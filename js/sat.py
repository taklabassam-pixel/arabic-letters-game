from collections import Counter
import re


def analyze_ids_from_js(file_path, output_report_path="report.txt"):
  try:
    # قراءة ملف الـ JavaScript
    with open(file_path, "r", encoding="utf-8") as file:
      content = file.read()

    # التعبير المنتظم للبحث عن الـ id
    pattern = r"id\s*:\s*['\"]([^'\"]+)['\"]"
    ids_found = re.findall(pattern, content)

    report_lines = []

    if not ids_found:
      msg = "⚠️ لم يتم العثور على أي قيم id مطابقة في الملف."
      print(msg)
      report_lines.append(msg)
    else:
      total_count = len(ids_found)
      id_counts = Counter(ids_found)

      report_lines.append(f"📊 إجمالي عدد الـ IDs المستخرجة: {total_count}")
      report_lines.append("----------------------------------------")
      report_lines.append("🔑 قائمة الـ IDs مع عدد التكرارات:")
      for item_id, count in id_counts.items():
        report_lines.append(f"  • {item_id} : {count} مرة")

      duplicates = {
          item_id: count for item_id, count in id_counts.items() if count > 1
      }
      report_lines.append("----------------------------------------")
      if duplicates:
        report_lines.append("⚠️ تنبيه: تم العثور على IDs مكررة:")
        for item_id, count in duplicates.items():
          report_lines.append(f"  • {item_id} (مكرر {count} مرات)")
      else:
        report_lines.append("✅ ممتاز! جميع الـ IDs فريدة ولا توجد أي تكرارات.")

      # طباعة النتائج على الشاشة
      for line in report_lines:
        print(line)

    # حفظ النتائج تلقائياً في ملف report.txt
    with open(output_report_path, "w", encoding="utf-8") as report_file:
      report_file.write("\n".join(report_lines) + "\n")

    print(f"\n📁 تم حفظ التقرير بنجاح في الملف: {output_report_path}")

  except FileNotFoundError:
    print(f"❌ خطأ: لم يتم العثور على الملف في المسار المحدد: {file_path}")
  except Exception as e:
    print(f"❌ حدث خطأ غير متوقع: {e}")


if __name__ == "__main__":
  analyze_ids_from_js("data.js", "report.txt")