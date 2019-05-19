// *.html|*.js|*.css

deltatime = 0;

function main()
{
    var engine = new Engine(document.getElementById("container"));


    engine.setup(function( eng , gfx , time , camera , input )
    {

        let texture = new Texture().fromURL("res/vodaa.png")
        let textureDome = new Texture().fromURL("res/skydome.jpg")

        let testObj = new GameObject("simple"  ,null ,"Sphere" ).setScale(600 , 600 ,600);
        testObj.material.setEmissive(0.3 , 0.3, 0.3)
        testObj.material.useTexture = 1;
        testObj.onUpdate = function(){ this.position = Engine.Instance.camera.position}
        

        let planeObj = new GameObject("Plane" ,null, "Plane").setScale(20 , 20 , 20).translate(0 , -2 , 0);
        planeObj.rotate( 0 , 0 , 1, 180)
        


       let jet = new GameObject("Jet" ,null, "Jet");
       jet.addBoxBody(4 , 1,4 ,3 );
       jet.translate(0 , 0 , -5)
       jet.material = Material.Metal();


       jet.deg = 0;
       jet.onStart = function()
       {
           this.deg  = 0;
           this.r = 15;
           this.speed = 2;

           console.log("started , "  ,  this.deg)

           
       }
       jet.onUpdate = function( input ,time )
       {
 
             this.deg +=  time.deltaTime*this.speed;
            this.rotate(0 ,  this.speed*time.deltaTime , 0)
       }

       let objx = new GameObject("cameraHolder");
    
        
        
        //let l3 = new Light(Light.Types.DirectionalLight).setColorHex("#D0D0D0").setDirection(0.2 ,-1,-0.2 );



        

        
       let l0 = new Light(Light.Types.PointLight).setColorHex("#FF8F7F").useObject();
       let l1 = new Light(Light.Types.PointLight).setColorHex("#0D8FFF").useObject();
       let l3 = new Light(Light.Types.PointLight).setColorHex("#0FDFe4").useObject();
       l1.gameObject.onUpdate = function()
       {
           let delta = Time.time;
           this.setPosition( Math.cos(delta) *10   ,  Math.sin(delta) *-1  ,   Math.sin(delta) *6 );
       }
       l0.gameObject.onUpdate = function()
       {
           let delta = -Time.time+60;
           this.setPosition( Math.cos(delta) *7   ,  (Math.sin(delta)+1) *2 ,   Math.sin(delta) *10 );
       }
       l3.gameObject.onUpdate = function()
       {
           let delta = -Time.time+1.7 ;
           this.setPosition( Math.cos(delta) *-7   ,  (Math.sin(delta)+5) *1 ,   Math.sin(delta) *-10 );
       }

        let l4 = new Light(Light.Types.FlashLight); 
        
        l4.constantAttenuation = 1;
        l4.linearAttenuation = 0.1;
        l4.quadraticAttenuation = 0;
       // l4.attachGameObject(objx)

        Camera.attachToGameObject( objx)
       

        objx.onUpdate = function(input , time)
        {

            //Camera.rotateRollPitchYaw( 0, input.mouse.relY,input.mouse.relX)

            Camera.rotateRollPitchYaw( 0, input.mouse.relY,input.mouse.relX)
            Camera.translate( input.xAxis() ,input.yAxis() ,input.zAxis() )
         
            l4.position = Camera.position;
            let  camdir = Camera.getDirection()
            l4.direction = camdir

            l4.direction[0] = camdir[0]
            l4.direction[1] = camdir[1]
            l4.direction[2] = camdir[2]



            
        }

        let dragobj = new GameObject("Box" ,null, "Dragon").translate(15 , 0 ,0);
        dragobj.material = Material.Red();


        new GameObject("Box" ,null, "Cube").translate(3 , 20 ,0).addBoxBody(1 , 1, 1 ,2 );
        new GameObject("Box" ,null, "Cube").translate(3.5 , 22, 4).addBoxBody(1 , 1, 1 ,2 );
        new GameObject("Box" ,null, "Cube").translate(3 , 19 ,1).addBoxBody(1 , 1, 1 ,2 );
        new GameObject("Box" ,null, "Cube").translate(3 , 14 ,8).addBoxBody(1 , 1, 1 ,2 );
        new GameObject("Box" ,null, "Cube").translate(3 , 26 ,8).addBoxBody(1 , 1, 1 ,2 );
        new GameObject("Box" ,null, "Cube").translate(3 , 28 ,8).addBoxBody(1 , 1, 1 ,2 );
        new GameObject("Box" ,null, "Cube").translate(3 , 16 ,8).addBoxBody(1 , 1, 1 ,2 );
        new GameObject("Box" ,null, "Cube").translate(6, 13 ,5).addBoxBody(1 , 1, 1 ,1 );


        new GameObject("Sphere" ,null, "Sphere").translate(6, 13 ,5).addSphereBody(1 , 1, 1 ,1 );



        new GameObject("Box" ,null, "Sphere").translate(6, 13 ,5).addSphereBody(1 , 2 );

        new GameObject("Box" ,null, "Sphere").translate(5, 5 ,1).addSphereBody(1 , 2 );

       
        planeObj.addBoxBody(20 , 0.1  ,20);
       // planeObj.addPlaneBody();


       let ballDestroyer =  new GameObject("BallDEst" ,null, "Sphere").translate(0, -30 ,0)
       ballDestroyer.addPlaneBody();
       ballDestroyer.onCollision = function(e)
       {
           console.log("dusen topu yok ediyoruz ");
           GameObject.DestroyObject(e.body.gameObject);
       }


    });





 

    engine.start(function()
    {

        if(Input.mouse.left)
        {
            let camPos = Camera.position;
            let camDir = Camera.getDirection();
            let obj = new GameObject("Sphere" ,null, "Sphere").setPosition(camPos[0] + camDir[0]*-2 , camPos[1] +camDir[1]*-2 ,camPos[2] +camDir[2]*-2).addSphereBody(1, 3 )
            obj.body.applyForce(-camDir[0] ,-camDir[1], -camDir[2] ,60);

            obj.onCollision = function(collision)
            {
      
               // console.log("coll " , e)
               if( collision.body.gameObject.name != "Plane" &&  collision.body.gameObject.name != "Jet" &&  collision.body.gameObject.name != "Sphere")
                GameObject.DestroyObject(collision.body.gameObject);
            }

            obj.onDestroy = function()
            {
                console.log("Destroying objecr " , this.name)
            }

            obj.material = Material.Dark();
            obj.material.diffuse[0] =  Math.random(); 
            obj.material.diffuse[1] =  Math.random(); 
            obj.material.diffuse[2] =  Math.random(); 

        }


    }
    );


}





//testModel