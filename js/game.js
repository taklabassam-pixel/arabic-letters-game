// js/game.js - منطق اللعبة والمستويات مع عداد الأسئلة (5 أسئلة لكل مستوى)

let currentLevel = 1;
let score = 0;
let currentTarget = null;

// متغيرات تتبع الأسئلة
let questionCount = 0;
const questionsPerLevel = 5;

// عناصر الصوت التفاعلية
const successAudio = document.getElementById('audio-success');
const wrongAudio = document.getElementById('audio-wrong');
const wordAudioPlayer = document.getElementById('audio-word-player');

// تشغيل الصوت الذاتي للكلمة المستهدفة أو الحرف في المستوى الثالث
function playCurrentAudio() {
  if (!currentTarget) return;

  let audioPath = currentTarget.audioPath; // المسار الافتراضي (للمستويات 1 و 2)

  // في المستوى الثالث، نستخدم مسار الصوت الخاص بالحرف المشكول المخصص
  if (currentLevel === 3 && currentTarget.letterAudioPath) {
    audioPath = currentTarget.letterAudioPath;
  }

  if (audioPath) {
    wordAudioPlayer.src = audioPath;
    wordAudioPlayer.currentTime = 0;
    wordAudioPlayer.play().catch(err => console.log("Audio file pending:", audioPath));
  }
}

// تحميل سؤال جديد (الكلمة المستهدفة + 3 خيارات صور/كلمات مطابقة بالكامل)
function loadQuestion() {
  const feedback = document.getElementById('feedback-msg');
  feedback.textContent = '';
  feedback.className = 'feedback-banner';

  if (educationalItems.length === 0) {
    console.error("educationalItems is not defined or empty.");
    return;
  }

  // التحقق من إنهاء الأسئلة الـ 5 للمستوى الحالي
  if (questionCount >= questionsPerLevel) {
    showLevelCompleteScreen();
    return;
  }

  // اختيار العنصر المستهدف ككتلة واحدة متكاملة (ID + Word + Image + Audio Paths)
  const randomIndex = Math.floor(Math.random() * educationalItems.length);
  currentTarget = educationalItems[randomIndex];

  // 🔍 تتبع للتأكد من تطابق الـ ID والمسارات في وحدة التحكم
  console.log("🎯 العنصر المستهدف الكامل:", currentTarget);

  const instruction = document.getElementById('instruction');
  const targetWord = document.getElementById('target-word');
  const optionsContainer = document.getElementById('options-container');

  optionsContainer.innerHTML = '';

  const progressText = ` (السؤال رقم ${questionCount + 1} )`;

  // ==========================================
  // المستوى 1: الكلمة والصورة
  // ==========================================
  if (currentLevel === 1) {
    instruction.textContent = ' إختر الصورة المطابقة للكلمة -' + progressText;
    targetWord.textContent = currentTarget.word;

    let pool = educationalItems.filter(item => item.id !== currentTarget.id);
    pool.sort(() => Math.random() - 0.5);
    let selectedOptions = [currentTarget, pool[0], pool[1]];
    selectedOptions.sort(() => Math.random() - 0.5);

    selectedOptions.forEach(item => {
      const card = document.createElement('div');
      card.className = 'option-card';
      
      const img = document.createElement('img');
      img.src = item.imagePath; // الصورة مرتبطة حصرياً بـ ID هذا الكائن
      img.alt = item.word;
      
      img.onerror = () => {
        card.innerHTML = `<span class="option-text">${item.word}</span>`;
      };

      card.appendChild(img);
      card.onclick = () => checkAnswer(item.id);
      optionsContainer.appendChild(card);
    });

    playCurrentAudio();

  // ==========================================
  // المستوى 2: الحرف والكلمة
  // ==========================================
  } else if (currentLevel === 2) {
    instruction.textContent = 'اختر الكلمة التي تبدأ بهذا الحرف:' + progressText;
    targetWord.textContent = `حرف (${currentTarget.letter})`;

    let pool = educationalItems.filter(item => item.id !== currentTarget.id);
    pool.sort(() => Math.random() - 0.5);
    let selectedOptions = [currentTarget, pool[0], pool[1]];
    selectedOptions.sort(() => Math.random() - 0.5);

    selectedOptions.forEach(item => {
      const card = document.createElement('div');
      card.className = 'option-card';
      card.innerHTML = `<span class="option-text">${item.word}</span>`;
      card.onclick = () => checkAnswer(item.id);
      optionsContainer.appendChild(card);
    });

  // ==========================================
  // المستوى 3: الحرف والصورة
  // ==========================================
  } else if (currentLevel === 3) {
    instruction.textContent = 'اختر الصورة التي تبدأ بهذا الحرف:' + progressText;
    
    // استخراج الحرف المشكول من الكلمة المستهدفة
    const firstLetterWithHarakat = currentTarget.word ? currentTarget.word.slice(0, 2) : currentTarget.letter;
    targetWord.textContent = `حرف - ${firstLetterWithHarakat}`;

    // فلترة المشتتات لضمان عدم التداخل
    let pool = educationalItems.filter(item => 
      item.id !== currentTarget.id && 
      (!item.word || item.word.slice(0, 2) !== firstLetterWithHarakat)
    );

    if (pool.length < 2) {
      pool = educationalItems.filter(item => item.id !== currentTarget.id);
    }

    pool.sort(() => Math.random() - 0.5);
    
    let selectedOptions = [currentTarget, pool[0], pool[1]];
    selectedOptions.sort(() => Math.random() - 0.5);

    optionsContainer.innerHTML = '';

    selectedOptions.forEach(item => {
      const card = document.createElement('div');
      card.className = 'option-card';
      
      const img = document.createElement('img');
      img.src = item.imagePath;
      img.alt = item.word;
      
      img.onerror = () => {
        card.innerHTML = `<span class="option-text">${item.word}</span>`;
      };

      card.appendChild(img);
      
      // تتبع مسار ملف الصوت الصريح المرتبط بالعنصر عند النقر
      card.onclick = () => {
        // استخراج اسم الملف الصوتي وحده من المسار للوضوح السريع في الكونسول
        const audioFileName = item.pictureAudioPath ? item.pictureAudioPath.split('/').pop() : 'غير متوفر';
        const letterAudioFileName = item.letterAudioPath ? item.letterAudioPath.split('/').pop() : 'غير متوفر';

        console.log("🔊 معرف/اسم ملف صوت الصورة (الفعلي):", audioFileName, "| المسار الكامل:", item.pictureAudioPath);
        console.log("🔊 معرف/اسم ملف صوت الحرف:", letterAudioFileName, "| المسار الكامل:", item.letterAudioPath);
        console.log("🏷️ ID العنصر النظيف:", item.id, "| الكلمة:", item.word);
        
        checkAnswer(item.id);
      };
      optionsContainer.appendChild(card);
    });
  }
}

// فحص الإجابة المختارة
function checkAnswer(selectedId) {
  const feedback = document.getElementById('feedback-msg');
  
  // تعطيل النقر المؤقت لمنع التكرار أثناء التشغيل
  const cards = document.querySelectorAll('.option-card');
  cards.forEach(card => card.style.pointerEvents = 'none');

  // التحقق هل الإجابة صحيحة أم خاطئة بناءً على المطابقة التامة للـ ID
  if (selectedId === currentTarget.id) {
    // إجابة صحيحة
    feedback.textContent = 'إجابة صحيحة! أحسنت 🎉';
    feedback.className = 'feedback-banner success';

    // 🎯 [إصلاح عداد النقاط]: زيادة النقاط وتحديث واجهتها مباشرة عند الإجابة الصحيحة
    if (typeof score !== 'undefined') {
      score += 10; // أو مقدار الزيادة المعتمد لديك لكل إجابة صحيحة
    }
    if (typeof updateScoreDisplay === 'function') {
      updateScoreDisplay(); // الدالة المسؤولة عن تحديث العداد على الشاشة إذا وجدت
    } else {
      // تحديث مباشر للعنصر في حال عدم وجود دالة منفصلة
      const scoreElement = document.getElementById('score') || document.getElementById('points');
      if (scoreElement) scoreElement.textContent = score;
    }

    // 🔊 تشغيل صوت النجاح العام فوراً في جميع المستويات (1، 2، و 3)
    if (typeof successAudio !== 'undefined' && successAudio) {
      successAudio.currentTime = 0;
      successAudio.play().catch(() => {});
    }

    // المنطق الخاص بالمستوى الثالث أو المستويات التي تعتمد على الصوت الصريح
    if (currentLevel === 3) {
      // استخدام مسار الصوت المخصص للصورة/الكلمة من الكائن مباشرة
      const pictureAudioSrc = currentTarget.pictureAudioPath || currentTarget.letterAudioPath;
      
      const audioFileName = pictureAudioSrc ? pictureAudioSrc.split('/').pop() : 'غير متوفر';
      console.log("🔊 تشغيل صوت الصورة/الفعلي (ملف):", audioFileName, "| المسار:", pictureAudioSrc);
      console.log("🎯 الـ ID المطابق:", currentTarget.id);

      const pictureAudio = new Audio(pictureAudioSrc);
      pictureAudio.play().catch(err => console.log("Picture audio error:", err));

      // 2. إعادة تشغيل صوت النجاح الإضافي بعد 2.5 ثانية (إذا رغبت) أو الاكتفاء بالصوت الأول
      setTimeout(() => {
        // 3. إطلاق الـ Confetti بعد انتهاء الصوت
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 }
          });
        }
      }, 2500);
    } else {
      // إطلاق الـ Confetti فوراً في المستويين 1 و 2
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    }

    // الانتقال للسؤال التالي بعد انتهاء المدة الزمنية
    questionCount++;
    setTimeout(() => {
      loadQuestion();
    }, currentLevel === 3 ? 3500 : 1500); // إعطاء وقت كافي للتشغيل في المستوى الثالث

 } else {
    // إجابة خاطئة
    feedback.textContent = 'حاول مرة أخرى! ❌';
    feedback.className = 'feedback-banner error';

    // 🔊 تشغيل ملف الفشل المعرف في HTML عبر الـ ID
    const wrongAudio = document.getElementById('audio-wrong');
    if (wrongAudio) {
      wrongAudio.currentTime = 0;
      wrongAudio.play().catch(err => console.log("Wrong audio error:", err));
    }

    // إعادة تفعيل النقر للسماح للمستخدم بالمحاولة مرة أخرى
    setTimeout(() => {
      cards.forEach(card => card.style.pointerEvents = 'auto');
      feedback.textContent = '';
      feedback.className = 'feedback-banner';
    }, 1200);
  }
}
// دالة مساعدة لتعطيل أو تفعيل النقر على الخيارات أثناء الانتقال
function disableOptions(disabled) {
  const options = document.querySelectorAll('.option-card');
  options.forEach(card => {
    card.style.pointerEvents = disabled ? 'none' : 'auto';
  });
}

// شاشة تهنئة عند إنهاء أسئلة المستوى بنجاح
function showLevelCompleteScreen() {
  const instruction = document.getElementById('instruction');
  const targetWord = document.getElementById('target-word');
  const optionsContainer = document.getElementById('options-container');
  const feedback = document.getElementById('feedback-msg');

  instruction.textContent = '🎉 تهانينا! أتممت هذا المستوى بجدارة';
  targetWord.textContent = `المستوى ${currentLevel} مكتمل`;
  feedback.textContent = 'أنت رائع! استمر إلى المستوى التالي';
  feedback.className = 'feedback-banner success';

  optionsContainer.innerHTML = '';

  if (currentLevel < 3) {
    const nextBtn = document.createElement('button');
    nextBtn.className = 'level-btn';
    nextBtn.style.padding = '15px 30px';
    nextBtn.style.fontSize = '18px';
    nextBtn.textContent = 'الانتقال للمستوى التالي ➡️';
    nextBtn.onclick = () => switchLevel(currentLevel + 1);
    optionsContainer.appendChild(nextBtn);
  } else {
    const finishBtn = document.createElement('button');
    finishBtn.className = 'level-btn';
    finishBtn.style.padding = '15px 30px';
    finishBtn.style.fontSize = '18px';
    finishBtn.textContent = '🏆 لقد أنهيت جميع المستويات! إعادة اللعبة';
    finishBtn.onclick = () => switchLevel(1);
    optionsContainer.appendChild(finishBtn);
  }

  if (typeof confetti === 'function') {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 }
    });
  }
}

// التبديل بين المستويات وتصفير العداد
function switchLevel(levelNumber) {
  currentLevel = levelNumber;
  questionCount = 0; 

  const buttons = document.querySelectorAll('.level-btn');
  buttons.forEach((btn, idx) => {
    btn.classList.toggle('active', idx + 1 === levelNumber);
  });

  loadQuestion();
}

window.onload = loadQuestion;