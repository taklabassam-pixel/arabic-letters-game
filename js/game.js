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
      img.src = item.imagePath;
      img.alt = item.word;
      
      img.onerror = () => {
        card.innerHTML = `<span class="option-text">${item.word}</span>`;
      };

      card.appendChild(img);
      // ✅ تمرير العنصر card هنا
      card.onclick = () => checkAnswer(item.id, card);
      optionsContainer.appendChild(card);
    });

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
      // ✅ تمرير العنصر card هنا أيضاً
      card.onclick = () => checkAnswer(item.id, card);
      optionsContainer.appendChild(card);
    });

  // ==========================================
  // المستوى 3: الحرف والصورة
  // ==========================================
  } else if (currentLevel === 3) {
    instruction.textContent = 'اختر الصورة التي تبدأ بهذا الحرف:' + progressText;
    
    const firstLetterWithHarakat = currentTarget.word ? currentTarget.word.slice(0, 2) : currentTarget.letter;
    targetWord.textContent = `حرف - ${firstLetterWithHarakat}`;

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
      
      card.onclick = () => {
        const audioFileName = item.pictureAudioPath ? item.pictureAudioPath.split('/').pop() : 'غير متوفر';
        const letterAudioFileName = item.letterAudioPath ? item.letterAudioPath.split('/').pop() : 'غير متوفر';

        console.log("🔊 معرف/اسم ملف صوت الصورة (الفعلي):", audioFileName, "| المسار الكامل:", item.pictureAudioPath);
        console.log("🔊 معرف/اسم ملف صوت الحرف:", letterAudioFileName, "| المسار الكامل:", item.letterAudioPath);
        console.log("🏷️ ID العنصر النظيف:", item.id, "| الكلمة:", item.word);
        
        // ✅ تمرير العنصر card هنا أيضاً في المستوى الثالث
        checkAnswer(item.id, card);
      };
      optionsContainer.appendChild(card);
    });
  }
}

// فحص الإجابة المختارة
// فحص الإجابة المختارة (مع استقبال العنصر النقر clickedCard)
function checkAnswer(selectedId, clickedCard) {
  const feedback = document.getElementById('feedback-msg');
  
  // تعطيل النقر المؤقت لمنع التكرار أثناء التشغيل
  const cards = document.querySelectorAll('.option-card');
  cards.forEach(card => card.style.pointerEvents = 'none');

  // التحقق هل الإجابة صحيحة أم خاطئة بناءً على المطابقة التامة للـ ID
  if (selectedId === currentTarget.id) {
    // إجابة صحيحة
    feedback.textContent = 'إجابة صحيحة! أحسنت 🎉';
    feedback.className = 'feedback-banner success';

    // 🎯 [إصلاح عداد النقاط]
    if (typeof score !== 'undefined') {
      score += 10;
    }
    if (typeof updateScoreDisplay === 'function') {
      updateScoreDisplay();
    } else {
      const scoreElement = document.getElementById('score') || document.getElementById('points');
      if (scoreElement) scoreElement.textContent = score;
    }

    // تلوين البطاقة الصحيحة بالاخضر اختياري (إن رغبت)
    if (clickedCard) {
      clickedCard.style.border = '4px solid #4CAF50';
    }

    // 🔊 تشغيل صوت العنصر الفعلي أولاً
    const audioSrc = currentTarget.pictureAudioPath || currentTarget.letterAudioPath;
    const targetAudio = new Audio(audioSrc);
    targetAudio.play().catch(err => console.log("Target audio error:", err));

    targetAudio.onended = () => {
      triggerSuccessAndNext();
    };

    const fallbackTimer = setTimeout(() => {
      if (targetAudio.paused) {
        triggerSuccessAndNext();
      }
    }, 2500);

    function triggerSuccessAndNext() {
      clearTimeout(fallbackTimer);
      
      const successAudioElem = document.getElementById('audio-success') || (typeof successAudio !== 'undefined' ? successAudio : null);
      if (successAudioElem) {
        successAudioElem.currentTime = 0;
        successAudioElem.play().catch(() => {});
      }

      if (typeof confetti === 'function') {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      }

      questionCount++;
      setTimeout(() => {
        transitionToNextQuestion();
      }, 3500);
    }
    
} else {
    // ❌ إجابة خاطئة

    console.log("🚨 تم الضغط على صورة خطأ! ID الذي تم النقر عليه:", selectedId, "بينما الهدف الصحيح هو:", currentTarget.id);
    feedback.textContent = 'حاول مرة أخرى! ❌';
    feedback.className = 'feedback-banner error';

    // 🔴 تلوين إطار البطاقة المضغوطة باللون الأحمر
    if (clickedCard) {
      clickedCard.classList.add('wrong-selection');

      // 🔍 [حقن الكونسول]: فحص الألوان والخصائص الفعلية المطبقة على العنصر الآن
      const computedStyle = window.getComputedStyle(clickedCard);
      console.log("----------------------------------------");
      console.log("🎨 لون الخلفية الفعلي (background-color):", computedStyle.backgroundColor);
      console.log("🎨 لون الإطار الفعلي (border-color):", computedStyle.borderColor);
      console.log("🎨 عرض الإطار الفعلي (border-width):", computedStyle.borderWidth);
      console.log("🎨 نمط الإطار (border-style):", computedStyle.borderStyle);
      console.log("🎨 تأثير الظل (box-shadow):", computedStyle.boxShadow);
      console.log("----------------------------------------");
    }

    // 🔊 تشغيل ملف الفشل
    const wrongAudio = document.getElementById('audio-wrong');
    if (wrongAudio) {
      wrongAudio.currentTime = 0;
      wrongAudio.play().catch(err => console.log("Wrong audio error:", err));
    }

    // إعادة تفعيل النقر وإزالة التأثيرات بعد انتهاء المدة
    setTimeout(() => {
      cards.forEach(card => {
        card.style.pointerEvents = 'auto';
        card.classList.remove('wrong-selection');
      });
      feedback.textContent = '';
      feedback.className = 'feedback-banner';
    }, 1200);
  }
}

// متغير لتتبع أعلى مستوى وصل إليه اللاعب
let highestUnlockedLevel = 1;

// دالة الانتقال بين المستويات (مع التحقق هل المستوى مفتوح أم لا)
function switchLevel(level) {
  if (level > highestUnlockedLevel) {
    alert("عقداً، يجب إكمال المستوى السابق أولاً لفتح هذا المستوى!");
    return;
  }

  currentLevel = level;
  questionCount = 0; // إعادة صياغة عداد الأسئلة عند تبديل المستوى
  
  // تحديث شكل الأزرار النشطة
  document.querySelectorAll('.level-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`level-btn-${level}`).classList.add('active');

  loadQuestion();
}

// دالة تحديث حالة الأزرار (فتح وإقفال بناءً على التقدم)
function updateLevelButtonsUI() {
  for (let i = 1; i <= 3; i++) {
    const btn = document.getElementById(`level-btn-${i}`);
    if (!btn) continue;

    if (i <= highestUnlockedLevel) {
      // فتح المستوى
      btn.disabled = false;
      btn.style.opacity = '1';
      btn.style.cursor = 'pointer';
      // إزالة علامة القفل إن وجدت من النص
      btn.textContent = btn.textContent.replace('🔒 ', '');
    } else {
      // إقفال المستوى
      btn.disabled = true;
      btn.style.opacity = '0.5';
      btn.style.cursor = 'not-allowed';
      if (!btn.textContent.includes('🔒')) {
        btn.textContent = '🔒 ' + btn.textContent;
      }
    }
  }
}

// دالة شاشة إنهاء المستوى والتقدم للمستوى التالي
function showLevelCompleteScreen() {
  const optionsContainer = document.getElementById('options-container');
  const targetWord = document.getElementById('target-word');
  const instruction = document.getElementById('instruction');
  const feedback = document.getElementById('feedback-msg');

  targetWord.textContent = "🎉 أحسنت!";
  instruction.textContent = `أتممت المستوى ${currentLevel} بنجاح!`;
  optionsContainer.innerHTML = '';
  feedback.textContent = '';

  // تحديث أعلى مستوى تم الوصول إليه
  if (currentLevel >= highestUnlockedLevel && currentLevel < 3) {
    highestUnlockedLevel = currentLevel + 1;
    updateLevelButtonsUI();
  }

  // زر الانتقال للمستوى التالي أو إعادة اللعب
  const nextBtn = document.createElement('button');
  nextBtn.className = 'level-btn active';
  nextBtn.style.padding = '12px 24px';
  nextBtn.style.fontSize = '18px';
  nextBtn.style.marginTop = '20px';

  if (currentLevel < 3) {
    nextBtn.textContent = `الانتقال إلى المستوى ${currentLevel + 1} 🚀`;
    nextBtn.onclick = () => switchLevel(currentLevel + 1);
  } else {
    nextBtn.textContent = `أتممت جميع المستويات! إعادة اللعب 🏆`;
    nextBtn.onclick = () => {
      highestUnlockedLevel = 1;
      updateLevelButtonsUI();
      switchLevel(1);
    };
  }

  optionsContainer.appendChild(nextBtn);
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

// دالة الانتقال للسؤال التالي بتأثير قلب الصفحة
function transitionToNextQuestion() {
  const container = document.getElementById('game-board') || document.getElementById('options-container').parentElement;
  
  // 1. تطبيق تأثير خروج الصفحة الحالية
  container.classList.add('page-flip-out');

  setTimeout(() => {
    // 2. تحميل السؤال الجديد في الوظيفة
    loadQuestion();

    // 3. إزالة كلاس الخروج وإضافة كلاس الدخول للصفحة الجديدة
    container.classList.remove('page-flip-out');
    container.classList.add('page-flip-in');

    // إزالة كلاس الدخول بعد انتهاء الحركة ليعود العنصر لحالته الطبيعية
    setTimeout(() => {
      container.classList.remove('page-flip-in');
    }, 600);

  }, 400); // الانتظار حتى ينصف تأثير الخروج
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