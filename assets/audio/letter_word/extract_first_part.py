import os
from pydub import AudioSegment
from pydub.silence import detect_nonsilent

# إعداد المجلدات
input_folder = "wor_lettere"    # مجلد الملفات الأصلية
output_folder = "letters"       # مجلد الحفظ

# إنشاء مجلد الحفظ إذا لم يكن موجوداً
os.makedirs(output_folder, exist_ok=True)

# إعدادات كشف الصمت والتقطيع
MIN_SILENCE_LEN = 300  # طول الصمت بالمللي ثانية لاعتباره فاصلاً (0.3 ثانية)
SILENCE_THRESH_OFFSET = -16  # عتبة الصوت للتفريق بين الكلام والصمت

for filename in os.listdir(input_folder):
    if filename.lower().endswith(('.mp3', '.wav', '.ogg', '.flac')):
        filepath = os.path.join(input_folder, filename)
        
        try:
            # تحميل ملف الصوت
            audio = AudioSegment.from_file(filepath)
            
            # الكشف عن المقاطع الصوتية غير الصامتة
            thresh = audio.dBFS + SILENCE_THRESH_OFFSET
            nonsilent_ranges = detect_nonsilent(audio, min_silence_len=MIN_SILENCE_LEN, silence_thresh=thresh)
            
            if nonsilent_ranges:
                # نأخذ بداية ونهاية "المقطع الأول فقط"
                start_i, end_i = nonsilent_ranges[0]
                
                # إضافة هامش صغير جداً في النهاية (100 ملي ثانية) لكي لا ينقطع الصوت فجأة
                padding = 100
                end_i_padded = min(len(audio), end_i + padding)
                
                # اقتطاع الجزء الأول
                first_part = audio[start_i:end_i_padded]
                
                # تحديد صيغة الحفظ بناءً على الملف الأصلي
                file_ext = filename.split('.')[-1].lower()
                output_path = os.path.join(output_folder, filename)
                
                # تصدير وحفظ الملف الجديد
                first_part.export(output_path, format=file_ext)
                print(f"تم بنجاح اقتطاع الجزء الأول من: {filename}")
            else:
                print(f"⚠️ تنبيه: لم يتم العثور على فواصل واضحة في الملف: {filename}")
                
        except Exception as e:
            print(f"❌ حدث خطأ أثناء معالجة الملف {filename}: {e}")

print("\n✨ تمت عملية معالجة جميع الملفات بنجاح!")