async function JSON (req, res) {
  const bufferBody = [];

  for await (const chunk of req) {
    bufferBody.push(chunk);
  }
  
  const body = Buffer.concat(bufferBody).toString();
    
  try {
    req.body = JSON.parse(body);
  } catch (error) {
    req.body = null;
  }
  
  res.setHeader('Content-type', 'application/json');
}

export const Middlewares = {
  JSON
}