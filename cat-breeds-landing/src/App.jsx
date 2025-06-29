import './App.css';
import React, { useState, useEffect } from 'react';

const breeds = [
  {
    name: 'Мейн-кун',
    image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80',
    description: `Мейн-кун — одна из самых крупных и дружелюбных пород кошек. Происходит из США, отличается густой длинной шерстью, мощным телосложением и кисточками на ушах. Характер у мейн-кунов ласковый, они отлично ладят с детьми и другими животными. Требуют регулярного вычесывания и внимания к здоровью суставов.`,
    catteries: [
      { country: 'Россия', name: 'EYKTAN cattery', url: 'https://eyktan.ru/' },
      { country: 'Россия', name: 'Catsvill County', url: 'https://mcoon.ru/' },
      { country: 'Россия', name: 'Instagram @catsvill_county_', url: 'https://instagram.com/catsvill_county_' },
      { country: 'Зарубежье', name: 'Tigercooncat (Таиланд)', url: 'https://www.tigercooncat.com/' },
    ],
    suitableFor: 'Подходит для семей с детьми, любителей крупных и ласковых кошек.'
  },
  {
    name: 'Сибирская кошка',
    image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=800&q=80',
    description: `Сибирская кошка — российская порода с густой водоотталкивающей шерстью. Отличается крепким здоровьем, независимым, но ласковым характером. Хорошо переносит холод, требует регулярного вычесывания.`,
    catteries: [
      { country: 'Россия', name: 'Питомник "Сибирская Сказка"', url: 'https://sibsaga.ru/' },
      { country: 'Зарубежье', name: 'Siberian Cats of Svetdanhaus (США)', url: 'https://siberiancatsusa.com/' },
    ],
    suitableFor: 'Подходит для аллергиков, семей с детьми, людей, ценящих независимость питомца.'
  },
  {
    name: 'Британская короткошерстная',
    image: 'https://images.unsplash.com/photo-1518715308788-3005759c61d3?auto=format&fit=crop&w=800&q=80',
    description: `Британская короткошерстная — спокойная, уравновешенная порода с плюшевой шерстью. Происходит из Великобритании, легко адаптируется к жизни в квартире, не требует сложного ухода.`,
    catteries: [
      { country: 'Россия', name: 'Питомник "British Glory"', url: 'https://britishglory.ru/' },
      { country: 'Зарубежье', name: 'British Shorthair Cattery (США)', url: 'https://britishshorthaircattery.com/' },
    ],
    suitableFor: 'Подходит для занятых людей, семей с детьми, пожилых.'
  },
  {
    name: 'Русская голубая',
    image: 'https://images.unsplash.com/photo-1518715308788-3005759c61d3?auto=format&fit=crop&w=800&q=80',
    description: `Русская голубая — элегантная кошка с серебристо-голубой шерстью и зелёными глазами. Порода известна своим спокойствием, преданностью и чистоплотностью. Не требует сложного ухода.`,
    catteries: [
      { country: 'Россия', name: 'Питомник "Blue Symphony"', url: 'https://bluesymphony.ru/' },
      { country: 'Зарубежье', name: 'Winterfrost Russian Blue (США)', url: 'https://winterfrostcats.com/' },
    ],
    suitableFor: 'Подходит для аллергиков, семей, одиноких людей.'
  },
  {
    name: 'Сфинкс',
    image: 'https://images.unsplash.com/photo-1518715308788-3005759c61d3?auto=format&fit=crop&w=800&q=80',
    description: `Сфинкс — бесшерстная порода с дружелюбным и игривым характером. Требует регулярного ухода за кожей и поддержания тепла. Очень общительны и привязаны к хозяину.`,
    catteries: [
      { country: 'Россия', name: 'Питомник "Sphynx Dynasty"', url: 'https://sphynxdynasty.ru/' },
      { country: 'Зарубежье', name: 'Sphynx Cattery (США)', url: 'https://sphynxcatscattery.com/' },
    ],
    suitableFor: 'Подходит для аллергиков, людей, ищущих контактного питомца.'
  },
  {
    name: 'Бенгальская кошка',
    image: 'https://images.unsplash.com/photo-1518715308788-3005759c61d3?auto=format&fit=crop&w=800&q=80',
    description: `Бенгальская кошка — экзотическая порода с леопардовым окрасом. Очень активна, умна, любит игры и воду. Требует внимания и пространства для активности.`,
    catteries: [
      { country: 'Россия', name: 'Питомник "Bengal House"', url: 'https://bengalhouse.ru/' },
      { country: 'Зарубежье', name: 'Bengal Cattery (США)', url: 'https://bengalcatscattery.com/' },
    ],
    suitableFor: 'Подходит для активных людей, семей с детьми, любителей экзотики.'
  },
  {
    name: 'Абиссинская кошка',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
    description: `Абиссинская кошка — одна из древнейших пород, отличается короткой шерстью, грациозностью и любознательностью. Очень активна, любит высоту и игры.`,
    catteries: [
      { country: 'Россия', name: 'Питомник "Aby Queen"', url: 'https://abyqueen.ru/' },
      { country: 'Зарубежье', name: 'Abyssinian Cattery (США)', url: 'https://abyssiniancatscattery.com/' },
    ],
    suitableFor: 'Подходит для активных людей, семей с детьми.'
  },
  {
    name: 'Тойгер',
    image: 'https://images.unsplash.com/photo-1518715308788-3005759c61d3?auto=format&fit=crop&w=800&q=80',
    description: `Тойгер — редкая порода, напоминающая мини-тигра. Короткая шерсть, яркий полосатый окрас, дружелюбный и игривый характер. Требует внимания и социализации.`,
    catteries: [
      { country: 'Россия', name: 'Питомник "Toyger Club"', url: 'https://toygerclub.ru/' },
      { country: 'Зарубежье', name: 'Toyger Cattery (США)', url: 'https://toygercat.com/' },
    ],
    suitableFor: 'Подходит для любителей экзотики, семей с детьми.'
  },
];

const fallbackImg = 'https://placehold.co/600x400?text=Cat+Image';

function App() {
  const [show, setShow] = useState(false);
  // Анимация появления
  useEffect(() => { setShow(true); }, []);

  return (
    <div className="landing-root">
      <header className="hero glass">
        <div className="logo-title">
          <span role="img" aria-label="cat" className="cat-emoji">🐾</span>
          <h1>Популярные породы кошек</h1>
        </div>
        <p className="subtitle">Выберите идеального пушистого друга для вашего дома</p>
      </header>
      <main className="breeds-list">
        {breeds.map((breed, i) => (
          <section
            className={`breed-card glass fade-in${show ? ' show' : ''}`}
            key={breed.name}
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <img
              className="breed-image"
              src={breed.image}
              alt={breed.name}
              onError={e => { e.target.src = fallbackImg; }}
            />
            <h2>{breed.name}</h2>
            <div className="breed-section">
              <h3>Описание</h3>
              <p>{breed.description}</p>
            </div>
            <div className="breed-section">
              <h3>Питомники</h3>
              <ul>
                {breed.catteries.length > 0 ? (
                  breed.catteries.map((cattery, idx) => (
                    <li key={idx}>
                      <strong>{cattery.country}:</strong> {cattery.url ? (
                        <a href={cattery.url} target="_blank" rel="noopener noreferrer">{cattery.name}</a>
                      ) : (
                        <span>актуальный питомник не найден</span>
                      )}
                    </li>
                  ))
                ) : (
                  <li>актуальный питомник не найден</li>
                )}
              </ul>
            </div>
            <div className="breed-section">
              <h3>Кому подходит</h3>
              <p>{breed.suitableFor}</p>
            </div>
          </section>
        ))}
      </main>
      <footer className="footer glass">
        <div className="footer-content">
          <span>© 2025 Кошачий гид</span>
          <span className="footer-icons">
            <a href="https://instagram.com/catsvill_county_" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"/></svg></a>
            <a href="https://eyktan.ru/" target="_blank" rel="noopener noreferrer" aria-label="Web"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></a>
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
