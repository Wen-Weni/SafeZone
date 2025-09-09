document.addEventListener('DOMContentLoaded', () => {
    const speech = document.getElementById('speech');
    const character = document.getElementById('character');
    const askBtn = document.getElementById('ask-btn');
    const dismissBtn = document.getElementById('dismiss-btn');
    const returnBtn = document.getElementById('return-btn');
    const questionBox = document.getElementById('question-box');
    const ficusContainer = document.getElementById('ficus-container');
    const speechBubble = document.querySelector('.speech-bubble');
  
    // Стани персонажа
    const characterStates = {
      idle: "images/state0.png",
      alert: "images/state1.png",
      talking1: "images/state2.png",
      talking2: "images/state3.png",
      talking3: "images/state4.png",
      talking4: "images/state5.png"
    };
  
    // Фрази та повідомлення
    const motivationalPhrases = [
      "Ти сильніший, ніж думаєш!",
      "Кожен крок — це шлях до зцілення.",
      "Турбота про себе — це не егоїзм.",
      "Пам'ятай: ти не сам у цьому.",
      "Дихай. Все буде добре.",
      "Не поспішай. Все приходить у свій час.",
      "Дозволь собі бути неідеальним.",
      "Твої почуття важливі.",
      "Сьогодні — новий день для нових початків."
    ];
  
    const clickReactions = [
      "Ти хочеш щось запитати?",
      "Я тут, щоб допомогти!",
      "Натисни кнопку зверху, щоб задати питання",
      "Приємно бачити, що ти активний!",
      "Я слухаю...",
      "Чим можу допомогти?",
      "Тут безпечно, можеш розповісти про свої почуття"
    ];
  
    const mainMessages = [
      "Привіт, я фікус Бенджаміна. Я буду твоїм супроводжуючим цим сайтом. Як рослина, я можу рости довгий час і потребую певного догляду, що уособлює тривалий процес самопізнання та зростання.",
      "Крім того, мене вважають рослиною, яка допомагає «очищати» емоційну атмосферу, що робить її придатною для медитацій та роздумів."
    ];
  
    const pageDescriptions = {
      "index": "Це головна сторінка — тут ти знайдеш усе найважливіше для підтримки психічного здоров'я.",
      "volunteering": "Це сторінка волонтерства — тут ти можеш отримати підтримку або сам допомогти іншим.",
      "art": "Це сторінка арт-терапії — простір для творчого самовираження та розслаблення.",
      "tests": "Тут можна пройти психологічні тести — дізнайся більше про свій стан.",
      "yoga": "Це сторінка йоги та медитацій — техніки для розслаблення та зняття стресу."
    };
  
    const questions = [
      { 
        text: "Як мені подолати тривогу?", 
        answer: "Спробуй техніки дихання: вдих на 4 рахунки, затримка на 4, видих на 6. Повтори кілька разів. Також можеш спробувати заземлення - назви 5 речей, які бачиш, 4 які чуєш, 3 які відчуваєш дотиком." 
      },
      { 
        text: "Як поліпшити свій психічний стан?", 
        answer: "Основні кроки:\n- Регулярні фізичні вправи\n- Здорове харчування\n- 7-9 годин сну\n- Соціальні зв'язки\n- Практика вдячності (запиши 3 речі, за які вдячний сьогодні)" 
      },
      { 
        text: "Як почати медитувати?", 
        answer: "Почни з малого:\n1. Виділи 5 хвилин\n2. Сідай зручно\n3. Зосередься на диханні\n4. Не суди себе за блукаючі думки\n5. Використовуй додатки для початківців (наприклад, Headspace)" 
      },
      { 
        text: "Як знайти психолога?", 
        answer: "В коледжі є психолог." 
      },      
        {
          text: "Хто виконував розробку і створення вебресурсу?",
          answer: "Дипломний проєкт на тему: «Розробка і створення вебресурсу «Психологічна допомога студентам у воєнний та післявоєнний час».<br>Створила: студентка IV курсу, групи КІ-1-21, Макарова Анастасія.<br>Керівник: Бахмет О.В."
        }
        
    ];
  
    // Стани та налаштування
    let isSpeaking = false;
    let animInterval;
    let reminderInterval;
    let hasIntroduced = false;
    let hasAskedWho = false;
    let isHidden = false;
  
    // Основні функції
    function setCharacterState(state) {
      character.src = characterStates[state];
    }
  
    function startAnimation() {
      let index = 2;
      setCharacterState('talking1');
      animInterval = setInterval(() => {
        const state = `talking${index}`;
        setCharacterState(state);
        index = index === 4 ? 1 : index + 1;
      }, 400);
    }
  
    function stopAnimation() {
      clearInterval(animInterval);
      setCharacterState('idle');
    }
  
    function showSpeechBubble() {
      speechBubble.style.display = 'block';
      setTimeout(() => speechBubble.classList.add('show'), 10);
    }
  
    function hideSpeechBubble() {
      speechBubble.classList.remove('show');
      setTimeout(() => speechBubble.style.display = 'none', 500);
    }
  
    function getPageName() {
      const path = window.location.pathname;
      if (path.includes("volunteering")) return "volunteering";
      if (path.includes("art")) return "art";
      if (path.includes("tests")) return "tests";
      if (path.includes("yoga")) return "yoga";
      return "index";
    }
  
    function getPageInfo() {
      return pageDescriptions[getPageName()] || "Це корисна сторінка для підтримки твого психічного здоров'я.";
    }
  
    function getRandomPhrase() {
      return motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];
    }
  
    function getRandomReaction() {
      return clickReactions[Math.floor(Math.random() * clickReactions.length)];
    }
  
    function sayMessage(message, duration = 5000) {
      if (isSpeaking) return;
      
      isSpeaking = true;
      speech.innerHTML = typeof message === 'function' ? message() : message.replace(/\n/g, '<br>');
      showSpeechBubble();
      startAnimation();
      
      setTimeout(() => {
        hideSpeechBubble();
        stopAnimation();
        isSpeaking = false;
      }, duration);
    }
  
    function showMessages(messages, onEnd = null) {
      let i = 0;
      isSpeaking = true;
      
      function nextMessage() {
        if (i < messages.length) {
          speech.innerHTML = messages[i];
          showSpeechBubble();
          startAnimation();
          
          setTimeout(() => {
            hideSpeechBubble();
            stopAnimation();
            i++;
            
            if (i < messages.length) {
              setTimeout(nextMessage, 1000);
            } else {
              isSpeaking = false;
              if (onEnd) onEnd();
            }
          }, 5000);
        }
      }
      
      nextMessage();
    }
  
    function showQuestionOptions() {
      questionBox.innerHTML = '';
      questions.forEach(q => {
        const el = document.createElement('div');
        el.innerHTML = q.text;
        el.addEventListener('click', () => {
          sayMessage(q.answer);
          hideQuestionBox();
        });
        questionBox.appendChild(el);
      });
      questionBox.style.display = 'block';
      setTimeout(() => questionBox.classList.add('show'), 10);
    }
  
    function hideQuestionBox() {
      questionBox.classList.remove('show');
      setTimeout(() => questionBox.style.display = 'none', 300);
    }
  
    function hideFicus() {
      ficusContainer.style.display = 'none';
      isHidden = true;
      returnBtn.style.display = 'block';
      hideQuestionBox();
      stopAnimation();
      setCharacterState('idle');
    }
  
    function returnFicus() {
      ficusContainer.style.display = 'block';
      isHidden = false;
      returnBtn.style.display = 'none';
      sayMessage("Радий знову бачити тебе! Як справи?");
    }
  
    function startReminders() {
      const minDelay = 30000; // 30 секунд
      const maxDelay = 60000; // 60 секунд
      
      function setNextReminder() {
        const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
        
        reminderInterval = setTimeout(() => {
          if (!isSpeaking && !isHidden) {
            sayMessage(getRandomPhrase());
          }
          setNextReminder();
        }, delay);
      }
      
      setNextReminder();
    }
  
    // Обробники подій
    askBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showQuestionOptions();
    });
  
    dismissBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hideFicus();
    });
  
    returnBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      returnFicus();
    });
  
    character.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!isSpeaking && !isHidden) {
        if (!hasIntroduced && getPageName() === 'index') {
          showMessages(mainMessages, () => {
            hasIntroduced = true;
          });
        } else {
          sayMessage(getRandomReaction());
        }
      }
    });
  
    document.addEventListener('click', (e) => {
      // Закриваємо питання при кліку поза блоком
      if (!questionBox.contains(e.target) && e.target !== askBtn && questionBox.style.display === 'block') {
        hideQuestionBox();
      }
      
      // Реакція на кліки поза фікусом
      if (!ficusContainer.contains(e.target) && e.target !== returnBtn && !isSpeaking && !isHidden) {
        sayMessage("Хм... Ти щось шукаєш? Натисни на мене, я допоможу!", 3000);
      }
    });
  
    // Початкова ініціалізація
    setTimeout(() => {
      setCharacterState('alert');
      
      setTimeout(() => {
        const page = getPageName();
        if (page === 'index') {
          showMessages(mainMessages, () => {
            hasIntroduced = true;
            startReminders();
          });
        } else {
          sayMessage(`Привіт! ${getPageInfo()}`, 4000);
          startReminders();
        }
      }, 1000);
    }, 2000);
  });