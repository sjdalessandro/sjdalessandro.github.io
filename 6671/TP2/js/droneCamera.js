
    function DroneCameraControl(initialPos){

        let MIN_Y=1;

        let DELTA_TRASLACION=0.1;        
        let DELTA_ROTACION=0.02;        
        let FACTOR_INERCIA=0.05;

        let vec3=glMatrix.vec3;  //defino vec3 para no tener que escribir glMatrix.vec3
        let mat4=glMatrix.mat4;

        if (!initialPos) initialPos=[0,0,0];

        let position=vec3.fromValues(initialPos[0],initialPos[1],initialPos[2]);
        let rotation=vec3.create();

        let worldMatrix=mat4.create();

        let camInitialState={
            xVel:0,
            zVel:0,
            yVel:0,
            xVelTarget:0,
            zVelTarget:0,
            yVelTarget:0,

            yRotVelTarget:0,
            yRotVel:0,
            zRotVelTarget:0,
            zRotVel:0,
            xRotVelTarget:0,
            xRotVel:0,
            
            rightAxisMode:"move"
        }

        let camState=Object.assign({},camInitialState);

        
        // Eventos de teclado **********************************************

        document.addEventListener("keydown",function(e){

            switch ( e.key ) {

                case "ArrowUp": // up
                    camState.zVelTarget=DELTA_TRASLACION; break;

                case "ArrowDown": // down
                    camState.zVelTarget=-DELTA_TRASLACION; break; 

                case "ArrowLeft": // left
                    camState.xVelTarget=DELTA_TRASLACION;break;

                case "ArrowRight": // right
                    camState.xVelTarget=-DELTA_TRASLACION; break;   

                case "w": // PgUp
                    camState.yVelTarget=DELTA_TRASLACION;break;

                case "s": // PgDw
                    camState.yVelTarget=-DELTA_TRASLACION; break;        
   
                case "a": 
                    camState.yRotVelTarget=DELTA_ROTACION; break;                

                case "d": 
                    camState.yRotVelTarget=-DELTA_ROTACION; break;
                        
                case "q": 
                    rotation=vec3.create();
                    position=vec3.fromValues(initialPos[0],initialPos[1],initialPos[2]);
                    camState=Object.assign({},camInitialState);
                    break;

                case "e": 
                    rotation=vec3.create();                    
                    camState=Object.assign({},camInitialState);
                    break;                    

            }               

        })

        document.addEventListener("keyup",function(e){

            switch ( e.key ) 
            {
                case "ArrowUp":  case "ArrowDown": 
                    camState.zVelTarget=0; break;
                
                case "ArrowLeft": case "ArrowRight": 
                    camState.xVelTarget=0; break;  

                case "w": case "s":
                    camState.yVelTarget=0;break;
  
                case "a": 
                    camState.yRotVelTarget=0; break;

                case "d": 
                    camState.yRotVelTarget=0; break;
            }                 
            
        })
        

        this.update=function(){
            
            camState.xVel+=(camState.xVelTarget-camState.xVel)*FACTOR_INERCIA;
            camState.yVel+=(camState.yVelTarget-camState.yVel)*FACTOR_INERCIA;
            camState.zVel+=(camState.zVelTarget-camState.zVel)*FACTOR_INERCIA;

            camState.xRotVel+=(camState.xRotVelTarget-camState.xRotVel)*FACTOR_INERCIA;
            camState.yRotVel+=(camState.yRotVelTarget-camState.yRotVel)*FACTOR_INERCIA;

            let translation=vec3.fromValues(-camState.xVel,camState.yVel,-camState.zVel);            

            let rotIncrement=vec3.fromValues(camState.xRotVel,camState.yRotVel,camState.zRotVel);            
            vec3.add(rotation,rotation,rotIncrement);

            rotation[0]=Math.min(Math.PI/8,Math.max(-Math.PI/8,rotation[0]));

            let rotationMatrix=mat4.create();		

            mat4.rotateX(rotationMatrix,rotationMatrix,rotation[0]);
            
            let yAxis=vec3.fromValues(0,1,0);
            let xRotation=mat4.create();
            mat4.rotateX(xRotation,xRotation,rotation[0]);
            vec3.transformMat4(yAxis,yAxis,xRotation);

            mat4.rotate(rotationMatrix,rotationMatrix,rotation[1],yAxis);
            
            vec3.transformMat4(translation,translation,rotationMatrix);
            vec3.add(position,position,translation);
            if (position[1] < 0.1) {
                position[1] = 0.1;
            }

            worldMatrix=mat4.create();
            mat4.translate(worldMatrix,worldMatrix,position);        
            mat4.multiply(worldMatrix,worldMatrix,rotationMatrix);
        }

        this.getViewMatrix=function(){

            let m=mat4.clone(worldMatrix);            
            mat4.invert(m,m);
            return m;
        }

        this.getMatrix=function(){

            return worldMatrix;

        }
    }
