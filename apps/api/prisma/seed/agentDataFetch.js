const fs = require('fs');
const csvParser = require("csv-parser");
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({
    datasources: {
        db: {
          url: `${process.env.DATABASE_URL}?connection_limit=100&pool_timeout=90`,
        },
      }
    }
  )
async function saveAgentClass(data){
    try{
        await prisma.agent.createMany({
            data: data,
            skipDuplicates: true,
          });
    }
    catch(error){
      console.error("Error", error)
      throw error;
    }
    finally {
        await prisma.$disconnect();
      }
}
async function main(){
    return  new Promise((resolve, reject)=>{
        try{
            const result = [];
            fs.createReadStream("./agentData/NCIDrugNames.csv")
                .pipe(csvParser())
                .on("data", (data) => {
                    result.push(data);
                })
                .on("end", () => {
                    const newResult=result.map((data)=>{
                        var id = Number(data.id);
                        var agent = data.agent.replace(/\(.*?\)/g, '');
                        return {id, agent}
                    });
                    resolve(newResult);
                })
                .on("error", (err) => {
                    reject(err); // Reject the Promise on error
                });
        }
        catch(err){
            console.log("Unable to fetch data because of following error:",err)
            reject(err);
        }
    });
}
main().then((result)=>{
    saveAgentClass(result)
}).catch(error=>{
    console.log("Error",error)
}).finally(async () => {
    await prisma.$disconnect()
  })