# ==========================================
# 🎙️ توليد أصوات أسماء الحروف والكلمات فقط لتطبيق اللعبة
# ==========================================

import os
import subprocess
import sys
from google.colab import files

venv_python = "/content/tts_venv/bin/python"

full_script_content = """
import os
import json
import shutil
import random
import numpy as np
import torch
import soundfile as sf
import torchaudio
from pydub import AudioSegment, effects
from pydub.silence import split_on_silence

def set_seed(seed=42):
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    np.random.seed(seed)
    random.seed(seed)

set_seed(42)

_original_torch_load = torch.load
def _patched_torch_load(*args, **kwargs):
    kwargs['weights_only'] = False
    return _original_torch_load(*args, **kwargs)
torch.load = _patched_torch_load

def custom_torchaudio_load(filepath, **kwargs):
    data, samplerate = sf.read(filepath, dtype='float32')
    tensor_data = torch.from_numpy(data)
    if tensor_data.ndim == 1:
        tensor_data = tensor_data.unsqueeze(0)
    elif tensor_data.ndim == 2:
        tensor_data = tensor_data.T
    return tensor_data, samplerate

torchaudio.load = custom_torchaudio_load

os.environ["COQUI_TOS_AGREED"] = "1"
os.environ['MPLBACKEND'] = 'Agg'

import transformers.pytorch_utils
if not hasattr(transformers.pytorch_utils, 'isin_mps_friendly'):
    transformers.pytorch_utils.isin_mps_friendly = torch.isin

from TTS.api import TTS

raw_reference_wav = "habiba_voice.wav"
prepared_reference_wav = "prepared_habiba_voice.wav"

def preprocess_reference(input_path, output_path):
    audio = AudioSegment.from_file(input_path)
    audio = audio.set_channels(1).set_frame_rate(24000)
    chunks = split_on_silence(audio, min_silence_len=300, silence_thresh=-40, keep_silence=100)
    if chunks:
        audio = chunks[0]
        for c in chunks[1:]:
            audio += c
    audio = effects.normalize(audio)
    if len(audio) > 10000:
        audio = audio[:10000]
    audio.export(output_path, format="wav", parameters=["-acodec", "pcm_s16le"])
    print(f"✨ تم تجهيز وتنقية العينة المرجعية: {output_path}")

if os.path.exists(raw_reference_wav):
    preprocess_reference(raw_reference_wav, prepared_reference_wav)
else:
    print("❌ خطأ: ملف habiba_voice.wav غير موجود!")

def isolate_first_utterance(file_path, min_dur=0.1, max_dur=3.5):
    try:
        audio = AudioSegment.from_file(file_path)
        chunks = split_on_silence(
            audio,
            min_silence_len=90,           
            silence_thresh=audio.max_dBFS - 14,
            keep_silence=50               
        )
        if not chunks:
            return False

        clean_utterance = chunks[0]
        duration_sec = len(clean_utterance) / 1000.0
        if duration_sec < min_dur or duration_sec > max_dur:
            return False

        clean_utterance.export(file_path, format="wav", parameters=["-acodec", "pcm_s16le"])
        return True
    except Exception:
        return False

# 📋 مصفوفة الكلمات والأسماء المستهدفة فقط للتوليد
game_audio_targets = [
    # 🦁 الحيوانات (10)
    {"text_to_speak": "أَسَدٌ", "filename": "word_asad.wav"},
    {"text_to_speak": "بَطَّةٌ", "filename": "word_batta.wav"},
    {"text_to_speak": "جَمَلٌ", "filename": "word_jamal.wav"},
    {"text_to_speak": "حِصَانٌ", "filename": "word_hisan.wav"},
    {"text_to_speak": "دُبٌّ", "filename": "word_dubb.wav"},
    {"text_to_speak": "ذِئْبٌ", "filename": "word_zib.wav"},
    {"text_to_speak": "زَرَافَةٌ", "filename": "word_zirafa.wav"},
    {"text_to_speak": "سَمَكَةٌ", "filename": "word_samaka.wav"},
    {"text_to_speak": "فِيلٌ", "filename": "word_fil.wav"},
    {"text_to_speak": "قِطَّةٌ", "filename": "word_qitta.wav"},
    {"text_to_speak": "ثَوْرٌ", "filename": "word_thawr.wav"},
    
    # 🍎 الفواكه والطبيعة (10)
    {"text_to_speak": "تُفَّاحَةٌ", "filename": "word_tuffaha.wav"},
    {"text_to_speak": "مَوْزَةٌ", "filename": "word_mawza.wav"},
    {"text_to_speak": "بُرْتُقَالَةٌ", "filename": "word_burtuqala.wav"},
    {"text_to_speak": "تِينٌ", "filename": "word_tin.wav"},
    {"text_to_speak": "ثُومٌ", "filename": "word_thum.wav"},
    {"text_to_speak": "رُمَّانٌ", "filename": "word_rumman.wav"},
    {"text_to_speak": "زَيْتُونٌ", "filename": "word_zaytun.wav"},
    {"text_to_speak": "عِنَبٌ", "filename": "word_inab.wav"},
    {"text_to_speak": "فَرَاوُلَةٌ", "filename": "word_frawla.wav"},
    {"text_to_speak": "لَيْمُونٌ", "filename": "word_laymun.wav"},
    
    # 🧸 الأشياء والأدوات (10)
    {"text_to_speak": "إِبْرِيقٌ", "filename": "word_ibriq.wav"},
    {"text_to_speak": "بَابٌ", "filename": "word_bab.wav"},
    {"text_to_speak": "تَاجٌ", "filename": "word_taj.wav"},
    {"text_to_speak": "جَرَسٌ", "filename": "word_jaras.wav"},
    {"text_to_speak": "دَرَّاجَةٌ", "filename": "word_darraja.wav"},
    {"text_to_speak": "زَهْرَةٌ", "filename": "word_zahra.wav"},
    {"text_to_speak": "سَيَّارَةٌ", "filename": "word_sayyara.wav"},
    {"text_to_speak": "قَلَمٌ", "filename": "word_qalam.wav"},
    {"text_to_speak": "كِتَابٌ", "filename": "word_kitab.wav"},
    {"text_to_speak": "مِفْتَاحٌ", "filename": "word_miftah.wav"}
    {"text_to_speak": "جِدَارٌ", "filename": "word_jidar.wav"}
]

print("🚀 تهيئة نموذج التوليد الصوتي (XTTS-v2)...")
tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to("cuda" if torch.cuda.is_available() else "cpu")

output_folder = "game_words_sounds"
os.makedirs(output_folder, exist_ok=True)

print("\\n🎧 بدء توليد أسماء الكلمات والحروف...")
for item in game_audio_targets:
    text = item["text_to_speak"]
    fname = item["filename"]
    out_path = os.path.join(output_folder, fname)
    
    print(f"توليد: {text} -> {fname}")
    
    try:
        tts.tts_to_file(
            text=text,
            speaker_wav=prepared_reference_wav,
            language="ar",
            file_path=out_path
        )
        
        isolate_first_utterance(out_path)
    except Exception as e:
        print(f"❌ خطأ في {fname}: {e}")

print(f"\\n🎉 تم الانتهاء! تجد الملفات في مجلد: '{output_folder}'")
"""