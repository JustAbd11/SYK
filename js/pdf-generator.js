/* =============================================
   pdf-generator.js
   توليد PDF الخطاب من البيانات المدخلة
   يُحفظ في C:\project\projectSYK\import.pdf
   ============================================= */

// يستخدم jsPDF عبر CDN
// يُستدعى من dashboard.html

function generateLetterPDF(data, receiptDataURL = null) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

  const pageW = 210;
  const margin = 18;
  let y = 18;

  // ---- خط مساعد ----
  function line(y2) {
    doc.setDrawColor(180, 150, 60);
    doc.setLineWidth(0.4);
    doc.line(margin, y2, pageW - margin, y2);
  }

  function rtlText(text, x, y2, opts = {}) {
    doc.text(text, x, y2, { align: opts.align || 'right', ...opts });
  }

  // ---- لوجو (إن وجد كـ base64) ----
  // doc.addImage(logoBase64, 'PNG', margin, y, 30, 12);

  // ---- العنوان ----
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(170, 130, 40);
  doc.text('SYK', pageW / 2, y + 6, { align: 'center' });
  y += 14;

  doc.setFontSize(11);
  doc.setTextColor(50, 50, 50);
  doc.text(`Letter No: ${data.letter_number || 'N/A'}`, pageW - margin, y, { align: 'right' });
  const now = new Date();
  doc.text(`Date: ${now.toLocaleDateString('ar-SA')}`, margin, y);
  y += 8;
  line(y); y += 7;

  // ---- نص الافتتاحية ----
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(60, 60, 60);
  const intro = [
    'الزملاء الكرام،',
    'بموجب هذا الخطاب، يتم توثيق كافة تفاصيل الخدمة المقدمة لعملائنا الكرام،',
    'لضمان أعلى معايير الدقة والاحترافية في عمليات شحن الرصيد وبطاقات الألعاب.',
    'صُمم هذا الخطاب ليكون مرجعاً تقنياً ومالياً يجسد التزامنا بالسرعة والموثوقية،',
    'ويهدف لتطوير تجربة العميل وبناء علاقة مستدامة قائمة على الثقة والشفافية',
    'في التعاملات الرقمية لعام 2026م.',
  ];
  intro.forEach(l => { doc.text(l, pageW - margin, y, { align: 'right' }); y += 6; });
  y += 4;

  // ---- جدول 1: بيانات العميل ----
  function drawTable(title, rows) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(150, 110, 30);
    doc.text(title, pageW - margin, y, { align: 'right' }); y += 6;
    line(y); y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(40, 40, 40);

    rows.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`${label}:`, pageW - margin, y, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      doc.text(value || 'N/A', pageW - margin - 38, y, { align: 'right' });
      y += 6;
    });
    y += 4;
    line(y); y += 6;
  }

  drawTable('بيانات العميل', [
    ['الاسم', data.client_name],
    ['الجوال', data.client_phone],
    ['المسؤول', data.responsible],
  ]);

  drawTable('تفاصيل المنتج الرقمي', [
    ['الخدمة', data.service],
    ['وصف المنتج', data.product_description],
  ]);

  drawTable('القسم المالي', [
    ['الكمية', data.quantity],
    ['سعر البيع', data.sale_price],
    ['تم الشحن المباشر للحساب', data.shipped_to_account],
    ['تم الشحن من حساب', data.shipped_from_account],
  ]);

  drawTable('تقييم العميل (المراجعة السنوية)', [
    ['تقييم التجربة', data.experience_rating],
    ['الملاحظات', data.notes],
    ['التحسينات', data.improvements],
  ]);

  // ---- نص الختام ----
  if (y > 230) { doc.addPage(); y = 20; }
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  const outro = [
    'إلى فريق عملنا المتميز،،',
    'نشكركم على جهودكم المخلصة ودقتكم في تنفيذ هذه العملية،',
    'إن التزامكم بتدوين هذه البيانات بمهنية عالية هو الركيزة التي نعتمد عليها',
    'في مراجعة نجاحاتنا السنوية وتطوير مستقبل متجرنا،',
    'نرجو منكم الاحتفاظ بهذا الخطاب والعناية به كمرجع أساسي يثبت جودة أدائكم',
    'ويعكس احترافيتكم في خدمة عملائنا، نحن نفخر بوجودكم معنا،',
    '.ومعاً نستمر في تقديم الأفضل',
    'تحية طيبة،،',
  ];
  outro.forEach(l => { doc.text(l, pageW - margin, y, { align: 'right' }); y += 6; });
  y += 8;

  // ---- التوقيعات ----
  line(y); y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('عن سايروكا', margin + 40, y);
  doc.text('عن سايروكا', pageW - margin - 40, y, { align: 'right' });
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.text('سليمان', margin + 40, y);
  doc.text('عبدالله', pageW - margin - 40, y, { align: 'right' });

  // ---- صفحة 2: الايصال ----
  if (receiptDataURL) {
    doc.addPage();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(150, 110, 30);
    doc.text('صورة الايصال', pageW / 2, 20, { align: 'center' });
    try {
      const imgType = receiptDataURL.includes('data:image/png') ? 'PNG' : 'JPEG';
      doc.addImage(receiptDataURL, imgType, margin, 30, pageW - margin * 2, 200);
    } catch (e) {
      doc.setFontSize(10);
      doc.text('تعذّر تحميل صورة الايصال', pageW / 2, 100, { align: 'center' });
    }
  }

  // حفظ الملف
  doc.save('import.pdf');
  return doc.output('datauristring');
}
