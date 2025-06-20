//POST in the body a .json object

type BookDTO= {

  title: String; 
  author: String;  
  genre: String;     
  rating: Number;      

}

export const useGetBookApi= async (book: BookDTO) => {

} 


export const useGetHelloAPI= async () => {

    try{
        const response = await fetch(`http://localhost:3000/api/book` , {
            method: "GET",
        });

        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const emailData = await response.json();

        console.log("Fetched email data:", emailData);

        return (emailData);
    }
    catch (error) {
        console.error("Error fetching email:", error);
        throw error;
    }
}