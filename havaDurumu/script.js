//HTML'den elemanları seç
const form = document.querySelector(".top-banner form")
const input = document.querySelector(".top-banner input")
const msg = document.querySelector(".top-banner .msg") 
const list  = document.querySelector(".ajax-section .cities")
const apiKey = "811b02ca457143168874049d97e720fd"

//Form gönderildiğinde çalışacak kodlar
form.addEventListener('submit', (e) => {
    e.preventDefault(); //Sayfanın yeniden yüklenmesini önler

    //Kullanıcının girdiği şehri al
    let inputVal = input.value

    //Eğer şehir listesinde zaten bir şehir varsa kontrol et
    const listItems = list.querySelectorAll(".ajax-selection .city")
    const listItemsArray = Array.from(listItems)

    if(listItemsArray.length > 0)
    {
        const filteredArray = listItemsArray.filter((el) => {
            let content = el.querySelector('.city-name span').textContent.toLowerCase()
            return content == inputVal.toLowerCase()
        });

        if(filteredArray.length > 0)
        {
            //Eğer şehir zaten listeye eklenmişse kullanıcıyı uyar
            msg.textContent = `Zaten  ${filteredArray[0].querySelector(".city-name span").textContent} şehrin hava durumunu biliyorsun.`
            form.reset()
            input.focus()
            return
        }
    }

    //API'den hava durumu bilgilerini almak için istek gönder
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`

    fetch (url)
    .then((response) => response.json())
    .then((data) => {
        const {main, name, sys, weather} = data
        const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0] ["icon"]}.svg`

        //Yeni bir liste öğesi oluştur ve hava durumu bilgilerini ekran üzerine yerleştir.
        const li = document.createElement("li")
        li.classList.add("city")

        const markup = `
        <h2 class= "city-name" data-name = "${name}, ${sys.country}">
            <span>${name}</span>
            <sup>${sys.country}</sup>   
        </h2>

        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>

        <figure>
            <img class= "city-icon" src="${icon}" alt="${weather[0]["description"]}"/>

            <figcaption>${weather[0]["description"]}</figcaption>
        </figure>
        `

        li.innerHTML = markup
        list.appendChild(li)

    })
    
    .catch(() => {
         //Hava durumu bilgileri alınamazsa çalışacak kod
        msg.textContent = "Lütfen geçerli bir şehir ara"
    })

    msg.textContent = "" //Mevcut mesajı temizle
    form.reset() //Formu sıfırla
    input.focus() //Şehir kutusuna
});