/* pdf-generator.js — v4
   ✅ العربي يطلع صح (html2canvas يحوّل HTML لصورة)
   ✅ ما يتحمل عند الحفظ — فقط من زر التنزيل
   ✅ اللوقو يظهر
   ✅ الموافق = هجري
   ✅ صفحة وحدة + صفحة الايصال منفصلة
*/

// ── هجري ────────────────────────────────────────
function toHijri(date) {
  try {
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
      day:'numeric', month:'long', year:'numeric'
    }).format(date);
  } catch(e) { return ''; }
}

// ── تحميل اللوقو ─────────────────────────────────
async function loadLogo() {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      c.getContext('2d').drawImage(img, 0, 0);
      resolve(c.toDataURL('image/png'));
    };
    img.onerror = () => resolve(null);
    img.src = 'logo/SYK-LOGO.png?' + Date.now();
  });
}

// ── HTML الخطاب ──────────────────────────────────
function buildHTML(data, logoSrc) {
  const now     = new Date();
  const miladi  = now.toLocaleDateString('ar-SA', {year:'numeric',month:'long',day:'numeric'});
  const hijri   = toHijri(now);

  const logo = logoSrc
    ? `<img src="${logoSrc}" style="height:55px;max-width:150px;object-fit:contain">`
    : `<span style="font-size:24px;font-weight:900;color:#8a6914;letter-spacing:2px">SYK</span>`;

  function rows(arr) {
    return arr.map(([l,v]) => `
      <tr>
        <td style="padding:5px 9px;border:1px solid #ccc;background:#fafafa;font-weight:600;color:#333;width:42%;text-align:right">${l}</td>
        <td style="padding:5px 9px;border:1px solid #ccc;text-align:right;color:#111">${v||'N/A'}</td>
      </tr>`).join('');
  }

  function sec(title, arr) {
    return `<div style="margin-bottom:10px">
      <div style="background:#8a6914;color:#fff;font-weight:700;font-size:11.5px;padding:5px 10px;border-radius:3px 3px 0 0">${title}</div>
      <table style="width:100%;border-collapse:collapse;font-size:11px">${rows(arr)}</table>
    </div>`;
  }

  const r = data.experience_rating || '';
  const s = data.sale_price || '';

  return `<div style="
    width:794px;background:#fff;
    padding:26px 42px;box-sizing:border-box;
    font-family:'IBM Plex Sans Arabic','Segoe UI',Tahoma,Arial,sans-serif;
    font-size:11px;line-height:1.5;color:#111;direction:rtl">

    <!-- هيدر -->
    <div style="display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:8px;margin-bottom:10px;border-bottom:2px solid #c9a84c">
      <div style="font-size:10.5px;color:#444;line-height:1.9;text-align:left">
        <div>التاريخ: ${miladi}</div>
        <div>الموافق: ${hijri}</div>
        <div>رقم الخطاب: <b style="color:#8a6914">${data.letter_number||''}</b></div>
      </div>
      <div>${logo}</div>
    </div>

    <!-- افتتاحية -->
    <p style="font-weight:700;margin:0 0 3px;font-size:11.5px">السلام عليكم ورحمة الله وبركاتة،،</p>
    <p style="font-weight:700;margin:0 0 2px;font-size:11px">بموجب هذا الخطاب، يتم توثيق كافة تفاصيل الخدمة المقدمة لعملائنا الكرام، لضمان أعلى معايير الدقة والاحترافية في عمليات شحن الرصيد وبطاقات الألعاب.</p>
    <p style="font-weight:700;margin:0 0 8px;font-size:11px">صُمم هذا الخطاب ليكون مرجعاً تقنياً ومالياً يجسد التزامنا بالسرعة والموثوقية، ويهدف لتطوير تجربة العميل وبناء علاقة مستدامة قائمة على الثقة والشفافية في التعاملات الرقمية لعام 2026م.</p>

    ${sec('.١ بيانات العميل :',[
      ['الاسم :',   data.client_name],
      ['الجوال :',  data.client_phone],
      ['المسؤول :', data.responsible],
    ])}
    ${sec('.٢ تفاصيل المنتج الرقمي :',[
      ['الخدمة :',                  data.service],
      ['وصف المنتج :',             data.product_description],
      ['تم الشحن المباشر للحساب:', data.shipped_to_account],
    ])}
    ${sec('.٣ القسم المالي :',[
      ['الكمية:',            data.quantity],
      ['سعر البيع:',         `( ${s} ) لاير.`],
      ['تم الشحن من حساب:', data.shipped_from_account],
    ])}
    ${sec('.٤ تقييم العميل (للمراجعة السنوية) :',[
      ['تقييم التجربة :',  `( ${r} / 10 ).`],
      ['ملاحظات:',         data.notes],
      ['التحسينات :',      data.improvements],
    ])}

    <!-- ختام -->
    <p style="font-weight:700;margin:6px 0 2px;font-size:11px">"إلى فريق عملنا المتميز،،</p>
    <p style="margin:0 0 6px;font-size:10.5px;line-height:1.65">نشكركم على جهودكم المخلصة ودقتكم في تنفيذ هذه العملية، إن التزامكم بتدوين هذه البيانات بمهنية عالية هو الركيزة التي نعتمد عليها في مراجعة نجاحاتنا السنوية وتطوير مستقبل متجرنا، نرجو منكم الاحتفاظ بهذا السجل والعناية به كمرجع أساسي يثبت جودة أدائكم ويعكس احترافيتكم في خدمة عملائنا، نحن نفخر بوجودكم معنا، ومعاً نستمر في تقديم الأفضل."</p>
    <p style="text-align:center;font-weight:700;margin:4px 0 10px;font-size:11px">تحية طيبة،،</p>

    <!-- توقيعات -->
    <div style="display:flex;justify-content:space-around;text-align:center;font-size:11px">
      <div>
        <div style="color:#555;margin-bottom:2px">عن سايروكا</div>
        <div style="font-weight:700;font-size:12px">عبدالله</div>
        <div style="width:100px;border-top:1px solid #444;margin:5px auto 0"></div>
      </div>
      <div>
        <div style="color:#555;margin-bottom:2px">عن سايروكا</div>
        <div style="font-weight:700;font-size:12px">سليمان</div>
        <div style="width:100px;border-top:1px solid #444;margin:5px auto 0"></div>
      </div>
    </div>
  </div>`;
}

// ── الدالة الرئيسية — تُستدعى فقط من زر التنزيل ────────────────
async function generateLetterPDF(data, receiptDataURL = null) {
  const logoSrc = await loadLogo();

  // div مخفي للرسم
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;background:#fff;';
  wrap.innerHTML = buildHTML(data, logoSrc);
  document.body.appendChild(wrap);

  try {
    const { jsPDF } = window.jspdf;
    const doc  = new jsPDF({orientation:'p', unit:'px', format:'a4', hotfixes:['px_scaling']});
    const pdfW = doc.internal.pageSize.getWidth();
    const pdfH = doc.internal.pageSize.getHeight();

    // ── صفحة 1: الخطاب كصورة (يدعم العربي 100%) ─────────────
    const cv = await html2canvas(wrap, {
      scale:2, useCORS:true, allowTaint:true,
      backgroundColor:'#ffffff', width:794, windowWidth:794
    });

    const imgH = pdfW * (cv.height / cv.width);

    if (imgH <= pdfH) {
      // صفحة واحدة ✅
      doc.addImage(cv.toDataURL('image/jpeg',0.93), 'JPEG', 0, 0, pdfW, imgH);
    } else {
      // يقسّم لو طال
      const scale = cv.width / pdfW;
      const pgH   = Math.floor(pdfH * scale);
      let pg = 0;
      for (let py = 0; py < cv.height; py += pgH) {
        if (pg > 0) doc.addPage();
        const sh = Math.min(pgH, cv.height - py);
        const sc = document.createElement('canvas');
        sc.width = cv.width; sc.height = sh;
        sc.getContext('2d').drawImage(cv, 0, py, cv.width, sh, 0, 0, cv.width, sh);
        doc.addImage(sc.toDataURL('image/jpeg',0.93), 'JPEG', 0, 0, pdfW, pdfW*(sh/cv.width));
        pg++;
      }
    }

    // ── صفحة 2: الايصال (فقط لو موجود) ──────────────────────
    if (receiptDataURL) {
      doc.addPage();

      // عنوان الصفحة
      const hd = document.createElement('div');
      hd.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;background:#fff;padding:20px 42px;box-sizing:border-box;font-family:Tahoma,Arial,sans-serif;direction:rtl';
      hd.innerHTML = `<div style="text-align:center;font-size:16px;font-weight:700;color:#8a6914;border-bottom:2px solid #c9a84c;padding-bottom:8px">صورة الإيصال</div>`;
      document.body.appendChild(hd);
      const hcv  = await html2canvas(hd, {scale:2, backgroundColor:'#ffffff', width:794});
      const hdH  = pdfW * (hcv.height / hcv.width);
      doc.addImage(hcv.toDataURL('image/jpeg',0.92), 'JPEG', 0, 0, pdfW, hdH);
      document.body.removeChild(hd);

      // صورة الايصال
      const ri = new Image();
      await new Promise(r => { ri.onload=r; ri.onerror=r; ri.src=receiptDataURL; });
      const mW=pdfW-40, mH=pdfH-hdH-20;
      let rW=mW, rH=mW*((ri.naturalHeight||1)/(ri.naturalWidth||1));
      if(rH>mH){rH=mH; rW=mH*((ri.naturalWidth||1)/(ri.naturalHeight||1));}
      const it = receiptDataURL.startsWith('data:image/png')?'PNG':'JPEG';
      doc.addImage(receiptDataURL, it, (pdfW-rW)/2, hdH+10, rW, rH);
    }

    // اسم الملف = رقم الخطاب
    const name = (data.letter_number||'import').replace(/[\/\\]/g,'-') + '.pdf';
    doc.save(name);

  } finally {
    if (wrap.parentNode) document.body.removeChild(wrap);
  }
}
