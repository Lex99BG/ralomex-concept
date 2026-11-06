# Higgsfield — промптове за атмосферните снимки

Пусни ги в Higgsfield и запиши резултатите в тази папка (`assets/generated/`) с точно тези имена.
Формат: JPG или PNG, най-добро качество. Аз ги правя на WebP в нужните размери.

Правила за всички (вече са вътре във всеки промпт):
- документална фотография, не илюстрация и не 3D
- приглушени, леко обезцветени тонове: тъмно горско зелено (#122E25, #173A2F) и топъл дъб (#B68652)
- фино филмово зърно, хоризонтални и диагонални линии
- **без машини, без трактори, без хора, без лога, без текст**

---

## 1. hero-field.jpg — Hero (десктоп)

Съотношение **16:9**, размер **2560×1440**. Настроение: тихо утро, сила, мащаб. Лявата трета и горната част остават тъмни за заглавието.

```
Documentary landscape photograph of a vast freshly ploughed field on the Danubian Plain in north-east Bulgaria at first light. Long straight furrows run diagonally from the lower right toward a low, distant horizon. Dark brown soil with crumbly clods catching a low warm sun from the right, thin ground mist, a faint line of poplar trees on the horizon. Muted, slightly desaturated colour grade: deep forest-green shadows (#122E25) and warm oak-brown highlights (#B68652). The left third and the upper half of the frame stay dark and calm as negative space for a headline. Wide dynamic range, subtle film grain, 35 mm lens at eye level, restrained premium European industrial look. No people, no tractors, no machines, no buildings, no text, no logos, no watermark.
```

## 1б. hero-field-mobile.jpg — Hero (телефон)

Същата снимка, рамкирана вертикално: **4:5**, **1080×1350**. Най-лесно: Reframe на първата в Higgsfield. Ако генерираш наново, ползвай същия промпт и добави:

```
Vertical 4:5 composition: the furrows lead from the bottom edge up to a horizon in the upper third; the top 40% of the frame is dark, empty sky for a headline.
```

## 2. about-land.jpg — 01 Компанията (залепената снимка вдясно)

Съотношение **5:4**, размер **2000×1600**. Настроение: земята около Завет, ред и спокойствие.

```
Aerial top-down documentary photograph of a farmland mosaic in the Ludogorie region of north-east Bulgaria in early morning. Rectangular fields of dark ploughed soil, pale stubble and young green wheat, separated by thin tree lines and straight dirt roads. Low sun casts long shadows from the tree lines across the fields. Muted, slightly desaturated grade in deep forest green (#173A2F) and warm oak brown (#B68652), soft haze, subtle film grain, strong geometric lines. No people, no vehicles, no machines, no buildings in focus, no text, no logos.
```

## 3. season-furrows.jpg — 04 Сезонът на нивата (снимката под заглавието)

Съотношение **2:1**, размер **2400×1200**. Настроение: след есенен дъжд, начало на сезона.

```
Low-angle panoramic documentary photograph across a ploughed field after autumn rain. Parallel furrows run straight toward the horizon, wet dark soil with a soft sheen, small puddles reflecting the sky. Overcast sky with a thin warm band of light at the horizon. Muted palette of deep forest green (#122E25) and warm oak (#B68652), slightly desaturated, subtle film grain, calm and heavy. No machines, no tractors, no people, no text, no logos.
```

## 4. archive-soil.jpg — 07 Архив и завод (широката плочка в галерията)

Съотношение **3:1**, размер **2400×800**. Настроение: материалът, с който работят машините.

```
Close-up documentary photograph of freshly turned dark soil seen from a low angle: broken clods and fine crumbs, a few pieces of straw stubble, raking side light from a low warm sun, shallow depth of field with the background falling into soft darkness. Warm oak highlights (#B68652) on deep brown-black earth, shadows tinted deep forest green (#122E25), muted, subtle film grain. No machines, no metal, no people, no text, no logos.
```

---

## Upscale на архивните снимки (не генериране!)

Тези четири са истински архивни снимки от сайта им, само 670×430 px. В галерията ще изглеждат меки на голям екран.
Пусни ги през **Upscale ×3** в Higgsfield с най-верния режим (без „creative“ подобрения, без промяна на детайли и надписи).
Запиши ги в `assets/ralomex/upscaled/` със същите имена:

- `arhiv-pn-6-40.jpg` — най-важна, отива в широката плочка
- `arhiv-pn-4-25.jpg`
- `arhiv-p-3-35m.jpg`
- `arhiv-pn-4-40.jpg`

Докато не дойдат, страницата ползва оригиналите.

---

## Генерирани на 5 ноември 2026 г. (Higgsfield, GPT Image 2.6, high, 2k)

Всички горни слотове + нови слотове, за да е страницата пълна със снимки. Нито една не показва машина, лого или човек, освен `plough-start.jpg`.

| Файл | Къде | Промпт накратко |
| --- | --- | --- |
| hero-field.jpg / hero-field-mobile.jpg | Hero | изорана нива на разсъмване (промпт 1 и 1б) |
| about-land.jpg | 01 Компанията | ниви отвисоко (промпт 2) |
| season-furrows.jpg | 04 Сезонът | бразди след дъжд (промпт 3) |
| archive-soil.jpg | 07 Архив | обърната почва отблизо (промпт 4) |
| step-1.jpg … step-6.jpg | 04 Сезонът, по една на етап | ожънат слънчоглед · дисковано стърнище · дълбоки бразди · пролетно легло за сеитба · уплътнена нива с поници · лозя и овощни редове |
| band-plains.jpg | лентата „Машини за модерно земеделие“ | равнините на Лудогорието на изгрев, 21:9 |
| contact-dusk.jpg | фон на 08 Запитване | ниви по здрач, тъмен фон |
| plough-start.jpg | кадър за клипа в hero | **техният плуг** от ralomex.com (PPRO.6.30-40.jpg като референция), поставен на края на изорана нива |
| spare-parts.jpg | карта „Резервни части“ | каталожна снимка на бял фон: лемежи, длето, назъбен диск, лапи за култиватор и болтове, без лога |

Клипът `assets/video/hero-plough-*.mp4` / `*.webm` е направен от `plough-start.jpg` с Kling 4.0 (image-to-video, 8 s, 1080p): плугът стои неподвижно, движат се само мъглата, прахът и светлината. По твое решение плугът е анимиран от тяхната снимка; провери детайлите преди да пратиш линка.
