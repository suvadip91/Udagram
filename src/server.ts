import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util';
import fs from 'fs';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  
  // Root Endpoint
  
  app.get( "/", async ( req:express.Request, res:express.Response ) => {
    res.send("try GET /filteredimage?image_url={{}}");
    
  } );

  // displayed image endpoint -- filteredimage?image_url={{}}
  app.get( "/filteredimage/", async ( req: express.Request, res: express.Response ) => {
    const image_url: string = req.query.image_url;
    if(image_url){
      const path: string = await filterImageFromURL(image_url);
      console.log(path);
      res.sendFile(path);
      res.on('finish', () => deleteLocalFiles([path]));
    }
    else{
      res.status(400).send("Please provide an valid image url");
      return;
    }
  
  } );
  
  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
