export async function fetchCountries() {
    try{
        const res = await fetch("https://restcountries.com/v3.1/all");
        const data = await res.json();
        if(res.ok){
            const countries = data.map((country =>{
                const currencies = country.currencies || {};
                const currencyCode = Object.keys(currencies)[0];
                return{
                    country: country.name.common || "",
                    flag: country.flags.png || "",
                    currency: currencyCode || "",
                };
            }))

            const sortedCountries = countries.sort((a, b) => {
                const nameA = a.country.toLowerCase();
                const nameB = b.country.toLowerCase();
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }
                return 0;
              });

            return sortedCountries;
        }else{
            console.log("error in fetching countries");
            return [];
        }
    }   catch(error){
        console.log(error);
        return [];
    }
}