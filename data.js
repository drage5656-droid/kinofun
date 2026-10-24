/* Данные каталога. Замените название канала и контакты своими.
Поля материала: id — уникальный адрес; title — название; type — film или animation;
year — год; genre — жанр; age — возраст; description — описание; poster — путь images/poster.jpg или URL;
palette — цвет заглушки; team.director/cast — команда; details — дополнительные сведения о фильме;
links.vk — ссылка для просмотра; isNew — метка новинки.
Чтобы добавить карточку, скопируйте объект из ITEMS и задайте новый id. */
const SITE = {
  name: "KinoFun — КиноФан",
  tagline: "У каждого вечера есть своя история.", // Замените описанием.
  stats: { materials: 21, subscribers: 195 },
  story:
    "Хороший вечер часто начинается с вопроса: что посмотреть? Так появился КиноФан — место, где можно быстро найти фильм или мультфильм, посмотреть трейлер и выбрать историю для настроения. А после титров — поделиться впечатлениями с другими зрителями.",
  milestones: [
    {
      title: "Началось с идеи",
      description:
        "Хотелось собрать интересное кино и мультфильмы в одном месте, чтобы выбор вечернего просмотра занимал меньше времени.",
    },
    {
      title: "Появились подборки",
      description:
        "В каталоге стали появляться карточки с описаниями, постерами и трейлерами — так проще понять, подходит ли история.",
    },
    {
      title: "КиноФан растёт",
      description:
        "Новые материалы и ваши отклики помогают постепенно развивать сайт и сообщество.",
    },
  ],
};
const CONTACTS = {
  telegram: "https://t.me/Kin0Fun",
  vk: "https://vk.ru/club242325248",
  vkChat: "https://vk.me/join/M5IS8SGfG2/cATtoODlwbNpf5S/pVCYjnYw=",
  max: "https://max.ru/u/f9LHodD0cOLq4XfYP6EPpvhD0qnzUuQ-U_fDqQnU0V-pNrGr9wqOYtI9jjE",
  whatsapp: "",
};
const ITEMS = [
  {
    id: "how-to-make-a-killing",
    title: "Наследник",
    type: "film",
    year: 2026,
    genre: "Криминальная комедия, триллер, драма",
    age: "18+",
    description:
      "Беккет Редфеллоу вырос вдали от чрезвычайно богатой семьи, отказавшейся от него ещё до рождения. Когда на кону оказывается наследство, он решает вернуть себе место среди родственников — и обнаруживает, что путь к состоянию превращается в опасную игру.",
    palette: "gold",
    poster:
      "https://api-asset-production.s3.amazonaws.com/media/images/GS_A24_HTMAK_Payoff_1x1.71.jpg",
    team: {
      director: "Джон Паттон Форд",
      cast: "Глен Пауэлл, Маргарет Куолли, Эд Харрис, Джессика Хенвик, Билл Кэмп, Рафферти Лоу, Зак Вудс",
    },
    details: {
      originalTitle: "How to Make a Killing",
      releaseDate: "20 февраля 2026 (США)",
      runtime: "105 минут",
      country: "США",
      language: "Русский",
      classification: "R (США; 18+)",
      screenplay: "Джон Паттон Форд",
      distribution: "A24",
      synopsis:
        "Беккет Редфеллоу — обычный парень, чья семья владеет огромным состоянием и отвергла его ещё до рождения. Узнав, что наследство может изменить его жизнь, Беккет пытается вернуть своё место в семейной династии. Богатство, старые обиды и соперничество превращают его стремление к лучшей жизни в мрачную криминальную историю.",
    },
    links: {
      telegram: "",
      vk: "https://vkvideo.ru/video-242325248_456239124",
      max: "",
      whatsapp: "",
      other: "",
    },
    trailer: "https://vkvideo.ru/video-9355855_456239473",
    isNew: true,
  },
  {
    id: "punisher-one-last-kill",
    title: "Каратель: Последнее убийство",
    type: "film",
    year: 2026,
    genre: "Боевик, триллер",
    age: "18+",
    description:
      "Фрэнк Касл пытается найти смысл жизни за пределами мести и оставить прошлое позади. Но новая сила вновь втягивает его в борьбу, заставляя столкнуться с призраками прошлого и решить, сможет ли он выбрать другой путь.",
    palette: "red",
    poster:
      "https://resizing.flixster.com/6pRJyskWzZHpMcwD4awtFZWd0vo=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzJkYjJkZWYwLTQ0NDItNDg0ZC05YTUyLTcyODMxNzk5MzRjOC5qcGc=",
    team: {
      director: "Рейнальдо Маркус Грин",
      cast: "Джон Бернтал, Джейсон Р. Мур, Роу Рэнселл, Мила Джеймс, Челси Бреа",
    },
    details: {
      originalTitle: "The Punisher: One Last Kill",
      releaseDate: "12 мая 2026 (Disney+)",
      runtime: "51 минута",
      country: "США",
      language: "Русский",
      classification: "TV-MA (США; 18+)",
      screenplay: "Джон Бернтал, Рейнальдо Маркус Грин",
      distribution: "Marvel Studios",
      synopsis:
        "Фрэнк Касл ищет смысл за пределами мести и пытается понять, возможна ли для него жизнь без насилия. Неожиданная угроза возвращает его в бой, а воспоминания о прошлом не дают просто начать всё заново. Специальный выпуск Marvel продолжает историю Карателя в самостоятельной напряжённой главе.",
    },
    links: {
      telegram: "",
      vk: "https://vkvideo.ru/video-242325248_456239125",
      max: "",
      whatsapp: "",
      other: "",
    },
    trailer: "https://vkvideo.ru/video-31575153_456245579",
    isNew: true,
  },
  {
    id: "practical-magic-2",
    title: "Практическая магия 2",
    type: "film",
    year: 2026,
    genre: "Романтическое фэнтези",
    age: "12+",
    description:
      "Спустя годы сёстры Салли и Джиллиан Оуэнс снова сталкиваются с древним семейным проклятием. Когда опасность грозит уже следующему поколению, им предстоит раскрыть тайну книги магии и защитить своих близких.",
    palette: "violet",
    poster:
      "https://upload.wikimedia.org/wikipedia/en/4/47/Practical_Magic_2_%28film_poster%29.png",
    team: {
      director: "Сюзанна Бир",
      cast: "Сандра Буллок, Николь Кидман, Дайан Уист, Стокард Чэннинг, Джоуи Кинг, Ли Пейс, Мэйси Уильямс, Шоло Маридуэнья",
    },
    details: {
      originalTitle: "Practical Magic 2",
      releaseDate: "10 сентября 2026 (США)",
      runtime: "130 минут",
      country: "США",
      language: "Русский",
      classification: "12A (Ирландия)",
    },
    links: {
      telegram: "",
      vk: "https://vkvideo.ru/video-242325248_456239097",
      max: "",
      whatsapp: "",
      other: "",
    },
    trailer: "https://vkvideo.ru/video-31575153_456245844",
    isNew: true,
  },
  {
    id: "onslaught",
    title: "Натиск",
    type: "film",
    year: 2026,
    genre: "Боевик, фантастика, ужасы",
    age: "16+",
    description:
      "Бывшая армейская снайперша Селеста живёт с дочерью Дейзи в трейлерном посёлке. Когда из секретного военного объекта сбегают генетически изменённые суперсолдаты, ей приходится защищать дочь и соседей от смертельной атаки.",
    palette: "green",
    poster:
      "https://upload.wikimedia.org/wikipedia/en/5/54/Onslaught_poster.jpg",
    team: {
      director: "Адам Вингард",
      cast: "Адриа Архона, Дэн Стивенс, Эрик Уэрхайм, Реджинальд ВелДжонсон, Майкл Бин, Алекс Перейра, Дрю Старки, Ребекка Холл",
    },
    details: {
      originalTitle: "Onslaught",
      releaseDate: "4 сентября 2026 (США)",
      runtime: "93 минуты",
      country: "США",
      language: "Русский",
      classification: "16 (Ирландия)",
    },
    links: {
      telegram: "",
      vk: "https://vkvideo.ru/video-242325248_456239093",
      max: "",
      whatsapp: "",
      other: "",
    },
    trailer: "https://vkvideo.ru/video-31575153_456245830",
    isNew: false,
  },
  {
    id: "mayday",
    title: "Мэйдэй",
    type: "film",
    year: 2026,
    genre: "Боевик, комедия",
    age: "16+",
    description:
      "1987 год. После неудачной разведывательной миссии над СССР американский пилот Трой Келли оказывается в руках бывшего офицера КГБ Николая Устинова. Чтобы выбраться из страны, неожиданным союзникам придётся скрываться от преследователей и научиться доверять друг другу.",
    palette: "orange",
    poster:
      "https://upload.wikimedia.org/wikipedia/en/0/01/Mayday_poster.jpg",
    team: {
      director: "Джон Фрэнсис Дейли, Джонатан Голдстейн",
      cast: "Райан Рейнольдс, Кеннет Брана, Марцин Дороциньский, Мария Бакалова, Дэвид Морс",
    },
    details: {
      originalTitle: "Mayday",
      releaseDate: "4 сентября 2026 (Apple TV)",
      runtime: "111 минут",
      country: "США",
      language: "Русский",
      classification: "M (Австралия)",
    },
    links: {
      telegram: "",
      vk: "https://vkvideo.ru/video-242325248_456239053",
      max: "",
      whatsapp: "",
      other: "",
    },
    trailer: "https://vkvideo.ru/video-227224074_456239394",
    isNew: true,
  },
  {
    id: "reckless",
    title: "Резкий",
    type: "film",
    year: 2026,
    genre: "Боевик, криминальная комедия",
    age: "Не указан",
    description:
      "Криминальная история с экшеном и комедией ошибок: неожиданные повороты и неверные предположения раз за разом меняют ход событий. Главную роль исполняет Скотт Эдкинс.",
    palette: "gold",
    poster:
      "https://m.media-amazon.com/images/M/MV5BMTQ5ZDhhOTgtYzk1YS00NWVkLTg5ZjMtY2ZlZDU4MmNhMTUxXkEyXkFqcGc@._V1_.jpg",
    team: {
      director: "",
      cast: "Скотт Эдкинс, Винни Джонс",
    },
    details: {
      originalTitle: "Reckless",
    },
    links: {
      telegram: "",
      vk: "https://vkvideo.ru/video-242325248_456239063",
      max: "",
      whatsapp: "",
      other: "",
    },
    trailer: "https://vkvideo.ru/video-222636001_456241308",
    isNew: true,
  },
  {
    id: "death-of-robin-hood",
    title: "Смерть Робин Гуда",
    type: "film",
    year: 2026,
    genre: "Триллер, драма",
    age: "18+",
    description:
      "Тяжело раненный Робин Гуд, всю жизнь промышлявший насилием, оказывается у загадочной женщины, которая предлагает ему последний шанс на спасение.",
    palette: "green",
    poster:
      "https://upload.wikimedia.org/wikipedia/en/6/6d/The_Death_of_Robin_Hood_poster.jpeg",
    team: {
      director: "Майкл Сарноски",
      cast: "Хью Джекман, Джоди Комер, Билл Скарсгард, Мюррей Бартлетт, Ноа Джуп",
    },
    details: {
      originalTitle: "The Death of Robin Hood",
      releaseDate: "19 июня 2026 (США)",
      country: "США",
      language: "Русский",
      distribution: "A24",
      synopsis:
        "В Англии XIII века состарившийся Робин Гуд живёт в уединении и тяжело переживает последствия своей жизни вне закона. Однажды его находит молодая женщина, потерявшая родных из-за его прошлых набегов. Робин остаётся жив, но получает тяжёлые ранения и укрывается в монастыре. Забота настоятельницы и знакомство с осиротевшей девочкой заставляют его снова взглянуть на прошлое и задуматься, возможно ли искупление.",
    },
    links: {
      telegram: "",
      vk: "https://vkvideo.ru/video-242325248_456239110",
      max: "",
      whatsapp: "",
      other: "",
    },
    trailer: "https://vkvideo.ru/video-219105850_456250721",
    isNew: true,
  },

  {
    id: "uboynaya-subbota",
    title: "Убойная суббота",
    type: "film",
    year: 2025,
    genre: "Боевик, комедия",
    age: "16+",
    description:
      "Безработный бухгалтер Брайан отправляется на детскую прогулку с новым знакомым Джеффом, но обычное свидание семей быстро превращается в погоню от наёмников.",
    palette: "orange",
    poster:
      "https://upload.wikimedia.org/wikipedia/en/4/42/Playdate_%28film%29_poster.jpg",
    team: {
      director: "Люк Гринфилд",
      cast: "Кевин Джеймс, Алан Ричсон, Сара Чок, Алан Тьюдик, Бенджамин Паяк",
    },
    details: {
      originalTitle: "Playdate",
      releaseDate: "12 ноября 2025 (Prime Video)",
      country: "США",
      language: "Русский",
      screenplay: "Нил Голдман",
      distribution: "Amazon Prime Video",
      synopsis:
        "После увольнения бухгалтер Брайан привыкает к роли отца-домоседа и пытается помочь пасынку Лукасу найти друзей. Знакомство с энергичным соседом Джеффом и его сыном Си-Джеем кажется хорошим началом — пока на семейную прогулку не нападают вооружённые преследователи. Джефф признаётся, что он и мальчик скрываются от властей, а обычная встреча превращается в погоню, где Брайану и детям приходится действовать сообща.",
    },
    links: {
      telegram: "",
      vk: "https://vkvideo.ru/video-242325248_456239103",
      max: "",
      whatsapp: "",
      other: "",
    },
    trailer: "https://vkvideo.ru/video-227596514_456242639",
    isNew: true,
  },

  {
    id: "matchbox",
    title: "Матчбокс",
    type: "film",
    year: 2026,
    genre: "Боевик, комедия",
    age: "16+",
    description:
      "Агент ЦРУ Шон Уокер возвращается в родной город и встречается со старыми друзьями. Их принимают за похитителей ядерной боеголовки, и теперь компании нужно вернуть её и очистить свои имена.",
    palette: "gold",
    poster:
      "https://upload.wikimedia.org/wikipedia/en/8/89/Matchbox-_The_Movie_poster.jpg",
    team: {
      director: "Сэм Харгрейв",
      cast: "Джон Сина, Джессика Бил, Сэм Ричардсон, Артуро Кастро, Теона Паррис",
    },
    details: {
      originalTitle: "Matchbox: The Movie",
      releaseDate: "9 октября 2026 (Apple TV)",
      country: "США",
      language: "Русский",
      screenplay: "Дэвид Коггешолл",
      distribution: "Apple TV",
      synopsis:
        "Шон Уокер — агент ЦРУ, которого служба внезапно возвращает в родной город. Там он снова встречает друзей детства, с которыми когда-то составлял компанию «Матчбокс». Вскоре Шона похищают, а его друзей втягивают в историю с пропавшей ядерной боеголовкой. Когда ЦРУ начинает подозревать в краже самих приятелей, им приходится самим вернуть оружие и доказать, что они не виноваты.",
    },
    links: {
      telegram: "",
      vk: "https://vkvideo.ru/video-242325248_456239099",
      max: "",
      whatsapp: "",
      other: "",
    },
    trailer: "https://vkvideo.ru/video-31575153_456245914",
    isNew: true,
  },

  {
    id: "astral-6",
    title: "Астрал 6",
    type: "film",
    year: 2026,
    genre: "Ужасы",
    age: "18+",
    description:
      "Молодая женщина, способная общаться с духами и переносить их в мир живых, становится мишенью зловещих сил.",
    palette: "violet",
    poster:
      "https://upload.wikimedia.org/wikipedia/en/5/5c/Insidious-out-of-the-further-poster.png",
    team: {
      director: "Джейкоб Чейз",
      cast: "Амелия Ив, Брэндон Переа, Мэйзи Ричардсон-Селлерс, Лин Шэй",
    },
    details: {
      originalTitle: "Insidious: Out of the Further",
      releaseDate: "21 августа 2026 (США)",
      country: "США",
      language: "Русский",
      screenplay: "Джейкоб Чейз, Дэвид Лесли Джонсон-Макголдрик",
      distribution: "Sony Pictures Releasing",
      synopsis:
        "Джемма способна общаться с духами и переносить их из Потустороннего мира в мир живых. Её необычный дар привлекает зловещие силы, которые начинают угрожать ей и близким. Шестая часть серии «Астрал» продолжает историю сверхъестественного мира, где граница между живыми и мёртвыми может открыться в любой момент.",
    },
    links: {
      telegram: "",
      vk: "https://vkvideo.ru/video-242325248_456239100",
      max: "",
      whatsapp: "",
      other: "",
    },
    trailer: "https://vkvideo.ru/video-31575153_456245914",
    isNew: true,
  },
  {
    id: "toy-story-5",
    title: "История игрушек 5",
    type: "animation",
    year: 2026,
    genre: "Приключения, комедия",
    age: "6+",
    description:
      "Вуди, Базз и Джесси сталкиваются с новым испытанием: любимицей Бонни становится Лилипад — умный планшет, который меняет привычный мир игрушек и их представление об игре.",
    palette: "gold",
    poster:
      "https://lumiere-a.akamaihd.net/v1/images/p_movies_toystory5_nowstreamingdisneyplus_poster_v1_93556266.jpeg?region=0%2C0%2C540%2C810",
    team: {
      director: "Эндрю Стэнтон",
      cast: "Том Хэнкс, Тим Аллен, Джоан Кьюсак, Грета Ли, Конан О’Брайен, Крэйг Робинсон",
    },
    details: {
      originalTitle: "Toy Story 5",
      releaseDate: "19 июня 2026 (США)",
      runtime: "102 минуты",
      country: "США",
      language: "Русский",
      classification: "PG (США)",
      screenplay: "Эндрю Стэнтон, Кенна Харрис",
      distribution: "Walt Disney Pictures",
      synopsis:
        "Когда Бонни получает планшет Лилипад, игрушки замечают, что девочка всё больше увлекается новым устройством и меньше играет с ними. Джесси пытается помочь Бонни найти настоящих друзей, а Вуди и Базз вновь объединяются с командой, чтобы понять, как изменилось детство в цифровом мире.",
    },
    links: {
      telegram: "",
      vk: "https://vkvideo.ru/video-242325248_456239049",
      max: "",
      whatsapp: "",
      other: "",
    },
    trailer: "https://vkvideo.ru/video-29218811_456249169",
    isNew: true,
  },
  {
    id: "paw-patrol-dino-movie",
    title: "Щенячий патруль: Динофильм",
    type: "animation",
    year: 2026,
    genre: "Приключения",
    age: "6+",
    description:
      "Щенки терпят крушение на таинственном острове динозавров и знакомятся с Рексом. Когда планы мэра Хамдингера вызывают извержение вулкана, команде предстоит спасти остров.",
    palette: "green",
    poster:
      "https://image.tmdb.org/t/p/w780/cxXSF4aY5N2cOGwaga5OnpPFHzk.jpg",
    team: {
      director: "",
      cast: "",
    },
    details: {
      originalTitle: "PAW Patrol: The Dino Movie",
      releaseDate: "2026",
      country: "Канада, США",
      language: "Русский",
      distribution: "Paramount Pictures",
      synopsis:
        "Щенячий патруль отправляется в экспедицию, но терпит крушение у таинственного острова, населённого динозаврами. Там команда знакомится со щенком Рексом и обнаруживает, что мэр Хамдингер готовит рискованный план. Чтобы не допустить извержения вулкана и спасти остров, щенкам предстоит объединить силы и действовать как настоящая команда.",
      classification: "PG (США)",
    },
    links: {
      telegram: "",
      vk: "https://vkvideo.ru/video-242325248_456239074",
      max: "",
      whatsapp: "",
      other: "",
    },
    trailer: "https://vkvideo.ru/video-227596514_456243337",
    isNew: true,
  },
  {
    id: "kpop-demon-hunters",
    title: "Кей-поп: охотницы на демонов",
    type: "animation",
    year: 2025,
    genre: "Музыкальное фэнтези",
    age: "12+",
    description:
      "Звёзды кей-попа Руми, Мира и Зои ведут двойную жизнь: выступают на сцене и защищают поклонников от демонов. Их главным испытанием становится бойз-бенд, участники которого скрывают свою демоническую сущность.",
    palette: "pink",
    poster:
      "https://image.tmdb.org/t/p/w780/zT7Lhw3BhJbMkRqm9Zlx2YGMsY0.jpg",
    team: {
      director: "Мэгги Кан, Крис Аппельханс",
      cast: "Арден Чо, Мэй Хон, Джиён Ю, Ан Хё-соп, Юнджин Ким, Джоэл Ким Бустер, Лиза Коши, Дэниэл Дэ Ким, Кен Жон, Ли Бён-хон",
    },
    details: {
      originalTitle: "KPop Demon Hunters",
      releaseDate: "Июнь 2025 (Netflix)",
      country: "США",
      language: "Русский",
      distribution: "Netflix",
      synopsis:
        "Руми, Мира и Зои выступают в популярной кей-поп-группе Huntrix, но за кулисами концертов они охотятся на демонов и защищают своих поклонников. Появление соперников из бойз-бенда Saja Boys усложняет задачу: участники группы оказываются демонами, а противостояние превращается в борьбу за души зрителей и будущее Huntrix.",
    },
    links: {
      telegram: "",
      vk: "https://vkvideo.ru/video-242325248_456239064",
      max: "",
      whatsapp: "",
      other: "",
    },
    trailer: "https://vkvideo.ru/video-224594873_456239425",
    isNew: false,
  },
  {
    id: "spongebob-search-squarepants",
    title: "Спанч Боб: В поиске квадратных штанов",
    type: "animation",
    year: 2025,
    genre: "Приключения, комедия",
    age: "6+",
    description:
      "Спанч Боб хочет доказать мистеру Крабсу, что он уже взрослый и смелый. Ради этого он отправляется за Летучим Голландцем в большое морское приключение.",
    palette: "blue",
    poster:
      "https://public-website-assets.paramountpictures.com/paramount2025/styles/hero_full/s3/2025-08/hero3.jpg?itok=F_UbCHMZ",
    team: {
      director: "Дерек Драймон",
      cast: "Том Кенни, Клэнси Браун, Роджер Бампасс, Билл Фагербакки, Кэролин Лоуренс, Мистер Лоуренс, Джордж Лопес, Айс Спайс, Артуро Кастро, Шерри Кола, Реджина Холл, Марк Хэмилл",
    },
    details: {
      originalTitle: "The SpongeBob Movie: Search for SquarePants",
      releaseDate: "19 декабря 2025 (США)",
      runtime: "89 минут",
      country: "США",
      language: "Русский",
      classification: "PG (США)",
      screenplay: "Пэм Брэди, Мэтт Либерман",
      distribution: "Paramount Pictures",
      synopsis:
        "Спанч Боб хочет доказать мистеру Крабсу, что он смелый и уже готов к большим испытаниям. Вместе с призрачным пиратом Летучим Голландцем он отправляется в подземный мир, где его ждут опасности и проверка дружбы. В этой истории герой учится быть храбрым не ради похвалы, а ради тех, кто ему дорог.",
    },
    links: {
      telegram: "",
      vk: "https://vkvideo.ru/video-242325248_456239047",
      max: "",
      whatsapp: "",
      other: "",
    },
    trailer: "https://vkvideo.ru/video-36249612_456245127",
    isNew: false,
  },
  {
    id: "hoppers",
    title: "Прыгуны",
    type: "animation",
    year: 2026,
    genre: "Фантастика, приключения, комедия",
    age: "6+",
    description:
      "Любительница животных Мейбл переносит своё сознание в робота-бобра и учится общаться с животными. Чтобы защитить их дом от человеческой угрозы, ей придётся объединить всё животное царство.",
    palette: "green",
    poster:
      "https://image.tmdb.org/t/p/w780/xjtWQ2CL1mpmMNwuU5HeS4Iuwuu.jpg",
    team: {
      director: "Дэниэл Чонг",
      cast: "Пайпер Курда, Бобби Мойнихэн, Джон Хэмм, Кэти Наджими, Дэйв Франко",
    },
    details: {
      originalTitle: "Hoppers",
      releaseDate: "6 марта 2026 (США)",
      country: "США",
      language: "Русский",
      screenplay: "Джесси Эндрюс",
      distribution: "Walt Disney Pictures",
      synopsis:
        "Студентка Мейбл любит животных и хочет защитить место их обитания от застройки. С помощью новой технологии она переносит сознание в роботизированного бобра и получает возможность общаться с животными напрямую. Неожиданный союз с обитателями леса помогает ей бороться за природу, но вскоре ситуация выходит из-под контроля.",
    },
    links: {
      telegram: "",
      vk: "https://vkvideo.ru/video-242325248_456239037",
      max: "",
      whatsapp: "",
      other: "",
    },
    trailer: "https://vkvideo.ru/video-226970548_456240465",
    isNew: true,
  },
  {
    id: "super-mario-galaxy-movie",
    title: "Супер Марио: Галактическое кино",
    type: "animation",
    year: 2026,
    genre: "Приключения, комедия",
    age: "6+",
    description:
      "Новое анимационное приключение Марио и его друзей во вселенной Super Mario — продолжение фильма «Братья Супер Марио в кино».",
    palette: "blue",
    poster:
      "https://www.universalpictures.com/assets/c59b11d7-111f-45c8-9d4e-70c6c9b8dcab.webp",
    team: {
      director: "Аарон Хорват, Майкл Джелениц",
      cast: "Крис Пратт, Аня Тейлор-Джой, Чарли Дэй, Джек Блэк, Киган-Майкл Ки, Бенни Сэфди, Дональд Гловер, Исса Рэй, Луис Гусман, Кевин Майкл Ричардсон, Бри Ларсон",
    },
    details: {
      originalTitle: "The Super Mario Galaxy Movie",
      releaseDate: "1 апреля 2026 (США)",
      country: "США, Япония",
      language: "Русский",
      distribution: "Universal Pictures",
      synopsis:
        "Марио и его друзья отправляются за пределы Грибного королевства — в космическое путешествие по галактикам. Героям предстоит встретить новых союзников и противников, исследовать необычные миры и остановить угрозу, которая может затронуть всю вселенную.",
    },
    links: {
      telegram: "",
      vk: "https://vkvideo.ru/video-242325248_456239019",
      max: "",
      whatsapp: "",
      other: "",
    },
    trailer: "https://vkvideo.ru/video-85484984_456246887",
    isNew: true,
  },
  {
    id: "hero-inside-imagination",
    title: "Герой внутри: Сила воображения",
    type: "animation",
    year: 2026,
    genre: "Приключения, фэнтези",
    age: "6+",
    description:
      "История связана с миром Hero Inside, где герои появляются из комиксов. Официальный синопсис именно полнометражного фильма «Сила воображения» пока не удалось подтвердить.",
    palette: "violet",
    poster:
      "https://image.tmdb.org/t/p/w780/c1mfsR4A7vOuYsrIETeFgxp1ZAf.jpg",
    team: {
      director: "",
      cast: "",
    },
    details: {
      originalTitle: "Hero Inside",
      releaseDate: "2026",
      synopsis:
        "В карточке указано название Hero Inside: Imagination. Удалось подтвердить постер проекта Hero Inside, но не найти официальный сюжет и данные о создателях именно полнометражной версии «Сила воображения». До уточнения оставлены только подтверждаемые сведения.",
    },
    links: {
      telegram: "",
      vk: "https://vkvideo.ru/video-242325248_456239083",
      max: "",
      whatsapp: "",
      other: "",
    },
    trailer: "https://vkvideo.ru/video-76240253_456248679",
    isNew: true,
  },
  {
    id: "swapped",
    title: "В чужой шкуре",
    type: "animation",
    year: 2026,
    genre: "Приключения, комедия",
    age: "6+",
    description:
      "Лесное создание и птица оказываются в телах друг друга. Чтобы вернуться к прежней жизни, им придётся объединиться и взглянуть на мир с неожиданной стороны.",
    palette: "green",
    team: {
      director: "Нейтан Грено",
      cast: "Майкл Б. Джордан, Джуно Темпл, Трейси Морган, Седрик Энтертейнер, Джастина Мачадо",
    },
    details: {
      originalTitle: "Swapped",
      releaseDate: "1 мая 2026",
      runtime: "98 минут",
      country: "США, Испания",
      language: "Русский",
      screenplay: "Джон Уиттингтон, Кристиан Магальяэс, Роберт Сноу",
      distribution: "Netflix",
      synopsis:
        "Олли, маленький обитатель лесной долины, и Айви, птица из соседнего племени, случайно меняются телами с помощью волшебного плода. Чтобы вернуть всё как было, им приходится вместе пересечь незнакомые места и научиться понимать друг друга. Их путешествие раскрывает давнюю историю долины и приводит к угрозе, опасной для всех её жителей.",
    },
    poster:
      "https://image.tmdb.org/t/p/w780/tHhxWxge06goXU6ZQH1hj7vK8Hd.jpg",
    links: {
      telegram: "",
      vk: "https://vkvideo.ru/video-242325248_456239079",
      max: "",
      whatsapp: "",
      other: "",
    },
    trailer: "https://vkvideo.ru/video-236650512_456239137",
    isNew: true,
  },
  {
    id: "the-land-of-sometimes",
    title: "Зачарованное королевство",
    type: "animation",
    year: 2026,
    genre: "Музыкальное фэнтези, приключения",
    age: "6+",
    description:
      "Близнецы Альфи и Элиз отправляются в волшебную страну, где времена года сменяются за один день. Их путешествие помогает им снова сблизиться и понять, что семья и дружба важнее исполнения желаний.",
    palette: "blue",
    team: {
      director: "Леон Джусен",
      cast: "Юэн Макгрегор, Хелена Бонэм Картер, Алиша Вейр, Аса Баттерфилд, Мел Брукс, Терри Джонс",
    },
    details: {
      originalTitle: "The Land of Sometimes",
      releaseDate: "2026",
      language: "Русский",
      screenplay: "Франческа Лонгригг",
      synopsis:
        "В канун Рождества близнецы Альфи и Элиз получают от матери необычные часы, оставленные пропавшим на войне отцом. Часы приводят их в Страну Иногда — волшебный мир, где все четыре времени года сменяются за один день, а загадочный Собиратель желаний предлагает исполнить их мечты. В музыкальном путешествии близнецы учатся снова поддерживать друг друга и понимают, что семья и дружба важнее желаний.",
    },
    poster:
      "https://img.usheru.com/eyJidWNrZXQiOiJzdGF0aWMudXNoZXJ1LmNvbSIsImtleSI6ImltZy9jaGFubmVscy9rYWxlaWRvc2NvcGVob21lZW50ZXJ0YWlubWVudC51c2hlcnUuY29tL21vdmllLWN1c3RvbS90aGUtbGFuZC1vZi1zb21ldGltZXNfZDAyMzA0MDAtNjdjZi00YzYxLWJlZWUtOWQ0Nzg1Y2FjZDA3anBlZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJjb3ZlciJ9fX0=",
    links: {
      telegram: "",
      vk: "https://vkvideo.ru/video-242325248_456239078",
      max: "",
      whatsapp: "",
      other: "",
    },
    trailer: "https://vkvideo.ru/video-159157918_456241978",
    isNew: true,
  },
  {
    id: "fixies-vs-crabbots",
    title: "Фиксики против кработов",
    type: "animation",
    year: 2019,
    genre: "Приключения, комедия",
    age: "6+",
    description:
      "Профессор Чудаков встречает бывшую одногруппницу Эрику, которая знает о фиксиках и хочет раскрыть их секрет. Её роботы-кработы вступают в противостояние с командой фиксиков.",
    palette: "orange",
    team: {
      director: "Васико Бедошвили, Олег Ужинов, Иван Пшонкин",
      cast: "Дмитрий Назаров, Нонна Гришаева, Лариса Брохман, Диомид Виноградов, Дмитрий Сыендук",
    },
    details: {
      originalTitle: "Фиксики против кработов",
      releaseDate: "21 декабря 2019",
      runtime: "86 минут",
      country: "Россия",
      language: "Русский",
      screenplay: "Евгений Антропов, Георгий Васильев",
      distribution: "Каропрокат",
      synopsis:
        "Учёная Эрика возвращается в жизнь профессора Чудакова и угрожает раскрыть его секрет — дружбу с фиксиками. Она вызывает Чудакова на состязание изобретателей, и обе стороны собирают команды помощников. Фиксикам предстоит объединиться против кработов — роботов-крабов, созданных Эрикой, и защитить тайну маленьких друзей.",
    },
    poster:
      "https://upload.wikimedia.org/wikipedia/ru/2/28/%D0%9F%D0%BE%D1%81%D1%82%D0%B5%D1%80_%D1%84%D0%B8%D0%BB%D1%8C%D0%BC%D0%B0_%C2%AB%D0%A4%D0%B8%D0%BA%D1%81%D0%B8%D0%BA%D0%B8_%D0%BF%D1%80%D0%BE%D1%82%D0%B8%D0%B2_%D0%BA%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BE%D0%B2%C2%BB.jpg",
    links: {
      telegram: "",
      vk: "https://vkvideo.ru/video-242325248_456239059",
      max: "",
      whatsapp: "",
      other: "",
    },
    trailer: "https://vkvideo.ru/video-24806617_456242542",
    isNew: true,
  },
  {
    id: "evolution",
    title: "Зверолюция",
    type: "animation",
    year: 2026,
    genre: "Анимация, семейный, комедия",
    age: "6+",
    description:
      "После контакта с инопланетным веществом ДНК Зои смешивается с ДНК её экзотических питомцев. Люди начинают превращаться в животных, а животные — в людей, и всем приходится найти общий язык, чтобы спасти мир.",
    palette: "gold",
    poster:
      "https://image.tmdb.org/t/p/w780/8tMZOnlFUa6zxlEF84QfghXnjuD.jpg",
    team: {
      director: "Зайра Муньос Домингес, Хулио Сото Гурпиде",
      cast: "",
    },
    details: {
      originalTitle: "Evolution",
      releaseDate: "6 февраля 2026 (Испания)",
      runtime: "94 минуты",
      screenplay: "Адела Гутьеррес, Мигель Моран",
      synopsis:
        "Инопланетное вещество смешивает ДНК Зои с ДНК её экзотических питомцев и запускает невероятные перемены: люди становятся животными, а животные — людьми. Чтобы остановить хаос и спасти мир, героям придётся понять друг друга и научиться действовать сообща.",
    },
    links: {
      telegram: "",
      vk: "https://vkvideo.ru/video-242325248_456239020",
      max: "",
      whatsapp: "",
      other: "",
    },
    trailer: "https://vkvideo.ru/video-31575153_456245685",
    isNew: true,
  },
];
const GENRES = [...new Set(ITEMS.map((item) => item.genre))];
