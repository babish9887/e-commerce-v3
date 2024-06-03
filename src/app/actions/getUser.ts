import db from "@/db/db"
export default async function getUser(email:string){
      return await db.user.findUnique({
            where: {
                  email:email
            }
      })
}