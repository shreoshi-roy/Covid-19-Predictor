// ALL COUNTRY NAMES WITH THEIR ISO CODE (codes are needed to fetch data from GoogleCharts API for map)
let country_list = [
    { name: 'US', code: 'US' },
    { name: 'Spain', code: 'ES' },
    { name: 'Italy', code: 'IT' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'UK', code: 'GB' },
    { name: 'Turkey', code: 'TR' },
    { name: 'Iran', code: 'IR' },
    { name: 'Russia', code: 'RU' },
    { name: 'Belgium', code: 'BE' },
    { name: 'Brazil', code: 'BR' },
    { name: 'Canada', code: 'CA' },
    { name: 'Netherlands', code: 'NL' },
    { name: 'Switzerland', code: 'CH' },
    { name: 'Portugal', code: 'PT' },
    { name: 'India', code: 'IN' },
    { name: 'Ireland', code: 'IE' },
    { name: 'Austria', code: 'AT' },
    { name: 'Peru', code: 'PE' },
    { name: 'Sweden', code: 'SE' },
    { name: 'Japan', code: 'JP' },
    { name: 'Korea, South', code: 'KR' },
    { name: 'Chile', code: 'CL' },
    { name: 'Saudi Arabia', code: 'SA' },
    { name: 'Poland', code: 'PL' },
    { name: 'Ecuador', code: 'EC' },
    { name: 'Romania', code: 'RO' },
    { name: 'Pakistan', code: 'PK' },
    { name: 'Mexico', code: 'MX' },
    { name: 'Denmark', code: 'DK' },
    { name: 'Norway', code: 'NO' },
    { name: 'United Arab Emirates', code: 'AE' },
    { name: 'Czechia', code: 'CZ' },
    { name: 'Australia', code: 'AU' },
    { name: 'Singapore', code: 'SG' },
    { name: 'Indonesia', code: 'ID' },
    { name: 'Serbia', code: 'RS' },
    { name: 'Philippines', code: 'PH' },
    { name: 'Ukraine', code: 'UA' },
    { name: 'Malaysia', code: 'MY' },
    { name: 'Belarus', code: 'BY' },
    { name: 'Dominican Republic', code: 'DO' },
    { name: 'Panama', code: 'PA' },
    { name: 'Finland', code: 'FI' },
    { name: 'Colombia', code: 'CO' },
    { name: 'South Africa', code: 'ZA' },
    { name: 'Egypt', code: 'EG' },
    { name: 'Argentina', code: 'AR' },
    { name: 'Morocco', code: 'MA' },
    { name: 'Thailand', code: 'TH' },
    { name: 'Algeria', code: 'DZ' },
    { name: 'Bangladesh', code: 'BD' },
    { name: 'Greece', code: 'GR' },
    { name: 'Hungary', code: 'HU' },
    { name: 'Croatia', code: 'HR' },
    { name: 'Iceland', code: 'IS' },
    { name: 'Kazakhstan', code: 'KZ' },
    { name: 'Uzbekistan', code: 'UZ' },
    { name: 'Estonia', code: 'EE' },
    { name: 'Iraq', code: 'IQ' },
    { name: 'New Zealand', code: 'NZ' },
    { name: 'Lithuania', code: 'LT' },
    { name: 'Armenia', code: 'AM' },
    { name: 'Oman', code: 'OM' },
    { name: 'North Macedonia', code: 'MK' },
    { name: 'Slovakia', code: 'SK' },
    { name: 'Cuba', code: 'CU' },
    { name: 'Hong Kong', code: 'HK' },
    { name: 'Cameroon', code: 'CM' },
    { name: 'Afghanistan', code: 'AF' },
    { name: 'Bulgaria', code: 'BG' },
    { name: 'Tunisia', code: 'TN' },
    { name: 'Ghana', code: 'GH' },
    { name: 'Lebanon', code: 'LB' },
    { name: 'Costa Rica', code: 'CR' },
    { name: 'Niger', code: 'NE' },
    { name: 'Kyrgyzstan', code: 'KG' },
    { name: 'Nigeria', code: 'NG' },
    { name: 'Bolivia', code: 'BO' },
    { name: 'Guinea', code: 'GN' },
    { name: 'Uruguay', code: 'UY' },
    { name: 'Honduras', code: 'HN' },
    { name: 'San Marino', code: 'SM' },
    { name: 'Palestine', code: 'PS' },
    { name: 'Malta', code: 'MT' },
    { name: 'Jordan', code: 'JO' },
    { name: 'Senegal', code: 'SN' },
    { name: 'Mauritius', code: 'MU' },
    { name: 'Sri Lanka', code: 'LK' },
    { name: 'Kenya', code: 'KE' },
    { name: 'Vietnam', code: 'VN' },
    { name: 'Guatemala', code: 'GT' },
    { name: 'Venezuela', code: 'VE' },
    { name: 'Mali', code: 'ML' },
    { name: 'Paraguay', code: 'PY' },
    { name: 'Tanzania', code: 'TZ' },
    { name: 'Martinique', code: 'MQ' },
    { name: 'Somalia', code: 'SO' },
    { name: 'Madagascar', code: 'MG' },
    { name: 'Myanmar', code: 'MM' },
    { name: 'Ethiopia', code: 'ET' },
    { name: 'Sudan', code: 'SD' },
    { name: 'Guyana', code: 'GY' },
    { name: 'Zambia', code: 'ZM' },
    { name: 'Bahamas', code: 'BS' },
    { name: 'Uganda', code: 'UG' },
    { name: 'Maldives', code: 'MV' },
    { name: 'Syria', code: 'SY' },
    { name: 'Mozambique', code: 'MZ' },
    { name: 'Mongolia', code: 'MN' },
    { name: 'Nepal', code: 'NP' },
    { name: 'Zimbabwe', code: 'ZW' },
    { name: 'Namibia', code: 'NA' },
    { name: 'Gambia', code: 'GM' },
    { name: 'Mauritania', code: 'MR' },
    { name: 'Bhutan', code: 'BT' },
    { name: 'South Sudan', code: 'SD' },
    { name: 'Yemen', code: 'YE' },
    { name: 'China', code: 'CN' }
];
// SELECT SEARCH COUNTRY ELEMENTS
const search_country_element= document.querySelector('.search-country');
const country_list_element= document.querySelector('.country-list');
const change_country_btn= document.querySelector('.change-country');
const close_list_btn= document.querySelector('.close');
const input= document.getElementById('search-input');
let num_of_ul_lists=3;


// CREATE COUNTRY LIST
function createCountryList(){
  const num_countries= country_list.length;
  let i=0, ul_list_id;

  country_list.forEach((country, index) =>{
    if(index% Math.ceil(num_countries/num_of_ul_lists)==0){
      ul_list_id = `list-${i}`;
      country_list_element.innerHTML+= `<ul id='${ul_list_id}'></ul>`;
      i++;
    }
    document.getElementById(`${ul_list_id}`).innerHTML +='<li id="'+country.name+'">'+country.name+'</li>';
  })
}
createCountryList();


// CLICK FUNCTIONALITY FOR COUNTRY LIST ITEMS BY USING EVENT DELEGATION AS LI ITEMS ARE CREATED DYNAMICALLY
//Event delegation allows us to attach event to the element targetted as well as ALL its children and descendant elements
document.getElementById("dynamic-country-list").addEventListener("click", function(e) {
if(e.target)               // e.target is the clicked element
    fetchData(e.target.id);
});


// SHOW/HIDE COUNTRY LIST ON CLICK EVENT
change_country_btn.addEventListener("click", function(){
  input.value = "";
  resetCountryList();   //otherwise list will only show last element searched
  search_country_element.classList.toggle("hide");
  search_country_element.classList.add("fadeIn");
});

close_list_btn.addEventListener("click", function(){
  search_country_element.classList.toggle("hide");
});

country_list_element.addEventListener("click", function(){
  search_country_element.classList.toggle("hide");
});


// COUNTRY FILTER
// input event fires up whenever the input value changes
input.addEventListener("input", function(){
  let value= input.value.toUpperCase();

  country_list.forEach(country =>{
    if(country.name.toUpperCase().startsWith(value)){
      document.getElementById(country.name).classList.remove("hide");
    }
    else{
      document.getElementById(country.name).classList.add("hide");
    }
  })
})


// RESET COUNTRY LIST (SHOW ALL COUNTRIES IN LIST AGAIN)
function resetCountryList(){
  country_list.forEach(country =>{
    document.getElementById(country.name).classList.remove("hide");
  })
}
