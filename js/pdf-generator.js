/* =============================================
   pdf-generator.js — v2
   يولد PDF بالعربي عن طريق تحويل HTML → صورة → PDF
   يدعم العربي 100% بدون مشاكل
   ============================================= */

async function generateLetterPDF(data, receiptDataURL = null) {
  const letterHTML = buildLetterHTML(data);

  const wrapper = document.createElement('div');
  wrapper.style.cssText = `
    position:fixed;left:-9999px;top:0;
    width:794px;background:#fff;
    font-family:'IBM Plex Sans Arabic','Segoe UI',Tahoma,Arial,sans-serif;
    direction:rtl;padding:0;margin:0;
  `;
  wrapper.innerHTML = letterHTML;
  document.body.appendChild(wrapper);

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation:'p', unit:'px', format:'a4', hotfixes:['px_scaling'] });
    const pdfW = doc.internal.pageSize.getWidth();
    const pdfH = doc.internal.pageSize.getHeight();

    // صفحة 1: الخطاب
    const canvas1 = await html2canvas(wrapper, {
      scale: 2, useCORS: true, backgroundColor:'#ffffff',
      width: 794, windowWidth: 794
    });
    const img1 = canvas1.toDataURL('image/jpeg', 0.93);
    const imgH = pdfW * (canvas1.height / canvas1.width);

    if (imgH <= pdfH) {
      doc.addImage(img1, 'JPEG', 0, 0, pdfW, imgH);
    } else {
      // تقسيم الصورة على صفحات
      const scale = canvas1.width / pdfW;
      const pagePixelH = Math.floor(pdfH * scale);
      let pageNum = 0;
      for (let py = 0; py < canvas1.height; py += pagePixelH) {
        if (pageNum > 0) doc.addPage();
        const sliceH = Math.min(pagePixelH, canvas1.height - py);
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas1.width;
        sliceCanvas.height = sliceH;
        sliceCanvas.getContext('2d').drawImage(canvas1, 0, py, canvas1.width, sliceH, 0, 0, canvas1.width, sliceH);
        const sliceImg = sliceCanvas.toDataURL('image/jpeg', 0.93);
        const sliceRenderH = pdfW * (sliceH / canvas1.width);
        doc.addImage(sliceImg, 'JPEG', 0, 0, pdfW, sliceRenderH);
        pageNum++;
      }
    }

    // صفحة 2: الايصال
    if (receiptDataURL) {
      doc.addPage();

      // عنوان صفحة الايصال
      const hdrDiv = document.createElement('div');
      hdrDiv.style.cssText = `position:fixed;left:-9999px;top:0;width:794px;background:#fff;padding:24px 48px;box-sizing:border-box;font-family:'IBM Plex Sans Arabic',Tahoma,Arial,sans-serif;direction:rtl;`;
      hdrDiv.innerHTML = `<div style="text-align:center;font-size:18px;font-weight:700;color:#8a6914;border-bottom:2px solid #c9a84c;padding-bottom:10px;margin-bottom:4px">صورة الايصال</div>`;
      document.body.appendChild(hdrDiv);
      const hdrCanvas = await html2canvas(hdrDiv, { scale:2, backgroundColor:'#ffffff', width:794 });
      const hdrImg = hdrCanvas.toDataURL('image/jpeg', 0.92);
      const hdrH = pdfW * (hdrCanvas.height / hdrCanvas.width);
      doc.addImage(hdrImg, 'JPEG', 0, 0, pdfW, hdrH);
      document.body.removeChild(hdrDiv);

      // صورة الايصال نفسها
      const ri = new Image();
      await new Promise(res => { ri.onload = res; ri.onerror = res; ri.src = receiptDataURL; });
      const maxW = pdfW - 40, maxH = pdfH - hdrH - 30;
      let rW = maxW, rH = maxW * ((ri.naturalHeight||1) / (ri.naturalWidth||1));
      if (rH > maxH) { rH = maxH; rW = maxH * ((ri.naturalWidth||1) / (ri.naturalHeight||1)); }
      const iType = receiptDataURL.startsWith('data:image/png') ? 'PNG' : 'JPEG';
      doc.addImage(receiptDataURL, iType, (pdfW - rW) / 2, hdrH + 10, rW, rH);
    }

    doc.save('import.pdf');
    return doc.output('datauristring');

  } finally {
    if (wrapper.parentNode) document.body.removeChild(wrapper);
  }
}

// =============================================
function buildLetterHTML(data) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('ar-SA', { year:'numeric', month:'long', day:'numeric' });

  function row(label, value) {
    return `<tr>
      <td style="font-weight:600;color:#555;width:45%;padding:7px 10px;border:1px solid #ddd;background:#fafafa">${label}</td>
      <td style="padding:7px 10px;border:1px solid #ddd;color:#222">${value || 'N/A'}</td>
    </tr>`;
  }

  function section(title, rows) {
    return `<div style="margin-bottom:16px">
      <div style="background:#8a6914;color:#fff;font-weight:700;font-size:13px;padding:8px 12px;border-radius:4px 4px 0 0">${title}</div>
      <table style="width:100%;border-collapse:collapse;font-size:12px">${rows.map(([l,v])=>row(l,v)).join('')}</table>
    </div>`;
  }

  return `<div style="width:794px;background:#fff;padding:40px 48px;box-sizing:border-box;color:#222;font-size:13px;line-height:1.7">
    <!-- هيدر -->
    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #c9a84c;padding-bottom:14px;margin-bottom:20px">
      <div style="font-size:11px;color:#666">${dateStr}</div>
      <div style="text-align:center">
        <div style="font-size:22px;font-weight:800;color:#8a6914;letter-spacing:3px">SYK</div>
        <div style="font-size:10px;color:#999;margin-top:2px">سايروكا</div>
      </div>
      <div style="font-size:13px;font-weight:700;color:#8a6914;background:#fffbf0;border:1px solid #c9a84c;padding:4px 12px;border-radius:4px">${data.letter_number||'N/A'}</div>
    </div>

    <!-- افتتاحية -->
    <div style="background:#fffdf5;border-right:4px solid #c9a84c;padding:14px 16px;margin-bottom:20px;border-radius:0 6px 6px 0;font-size:12.5px;line-height:1.9;color:#333">
      الزملاء الكرام،<br>
      بموجب هذا الخطاب، يتم توثيق كافة تفاصيل الخدمة المقدمة لعملائنا الكرام، لضمان أعلى معايير الدقة
      والاحترافية في عمليات شحن الرصيد وبطاقات الألعاب.<br>
      صُمم هذا الخطاب ليكون مرجعاً تقنياً ومالياً يجسد التزامنا بالسرعة والموثوقية، ويهدف لتطوير تجربة
      العميل وبناء علاقة مستدامة قائمة على الثقة والشفافية في التعاملات الرقمية لعام 2026م.
    </div>

    ${section('بيانات العميل',[['الاسم',data.client_name],['الجوال',data.client_phone],['المسؤول',data.responsible]])}
    ${section('تفاصيل المنتج الرقمي',[['الخدمة',data.service],['وصف المنتج',data.product_description]])}
    ${section('القسم المالي',[['الكمية',data.quantity],['سعر البيع',data.sale_price],['تم الشحن المباشر للحساب',data.shipped_to_account],['تم الشحن من حساب',data.shipped_from_account]])}
    ${section('تقييم العميل (المراجعة السنوية)',[['تقييم التجربة',data.experience_rating],['الملاحظات',data.notes],['التحسينات',data.improvements]])}

    <!-- ختام -->
    <div style="background:#f9f9f9;border:1px solid #e8e8e8;padding:14px 16px;border-radius:6px;margin-top:8px;font-size:12px;line-height:1.9;color:#444">
      إلى فريق عملنا المتميز،،<br>
      نشكركم على جهودكم المخلصة ودقتكم في تنفيذ هذه العملية، إن التزامكم بتدوين هذه البيانات بمهنية عالية هو الركيزة
      التي نعتمد عليها في مراجعة نجاحاتنا السنوية وتطوير مستقبل متجرنا، نرجو منكم الاحتفاظ بهذا الخطاب والعناية به
      كمرجع أساسي يثبت جودة أدائكم ويعكس احترافيتكم في خدمة عملائنا، نحن نفخر بوجودكم معنا، ومعاً نستمر في تقديم الأفضل.<br>
      <strong>تحية طيبة،،</strong>
    </div>

    <!-- توقيعات -->
    <div style="display:flex;justify-content:space-around;margin-top:28px;padding-top:16px;border-top:2px solid #e8e8e8;text-align:center">
      <div>
        <div style="font-size:11px;color:#888;margin-bottom:4px">عن سايروكا</div>
        <div style="font-weight:700;font-size:14px;color:#333">عبدالله</div>
        <div style="width:100px;border-top:1px solid #999;margin:8px auto 0"></div>
      </div>
      <div>
        <div style="font-size:11px;color:#888;margin-bottom:4px">عن سايروكا</div>
        <div style="font-weight:700;font-size:14px;color:#333">سليمان</div>
        <div style="width:100px;border-top:1px solid #999;margin:8px auto 0"></div>
      </div>
    </div>
  </div>`;
}
