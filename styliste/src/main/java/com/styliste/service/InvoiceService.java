/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.lowagie.text.Chunk
 *  com.lowagie.text.Document
 *  com.lowagie.text.DocumentException
 *  com.lowagie.text.Element
 *  com.lowagie.text.Font
 *  com.lowagie.text.FontFactory
 *  com.lowagie.text.PageSize
 *  com.lowagie.text.Paragraph
 *  com.lowagie.text.Phrase
 *  com.lowagie.text.pdf.ColumnText
 *  com.lowagie.text.pdf.PdfContentByte
 *  com.lowagie.text.pdf.PdfPCell
 *  com.lowagie.text.pdf.PdfPTable
 *  com.lowagie.text.pdf.PdfWriter
 *  com.styliste.entity.Invoice
 *  com.styliste.entity.InvoiceStatus
 *  com.styliste.entity.Order
 *  com.styliste.entity.OrderItem
 *  com.styliste.entity.OrderItemStatus
 *  com.styliste.entity.PaymentMethod
 *  com.styliste.entity.PaymentStatus
 *  com.styliste.repository.InvoiceRepository
 *  com.styliste.service.InvoiceService
 *  com.styliste.service.InvoiceService$1
 *  org.slf4j.Logger
 *  org.slf4j.LoggerFactory
 *  org.springframework.beans.factory.annotation.Autowired
 *  org.springframework.stereotype.Service
 */
package com.styliste.service;

import com.lowagie.text.Chunk;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.ColumnText;
import com.lowagie.text.pdf.PdfContentByte;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.styliste.entity.Invoice;
import com.styliste.entity.InvoiceStatus;
import com.styliste.entity.Order;
import com.styliste.entity.OrderItem;
import com.styliste.entity.OrderItemStatus;
import com.styliste.entity.PaymentMethod;
import com.styliste.entity.PaymentStatus;
import com.styliste.repository.InvoiceRepository;
import com.styliste.service.InvoiceService;
import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InvoiceService {
    private static final Logger log = LoggerFactory.getLogger(InvoiceService.class);
    @Autowired
    private InvoiceRepository invoiceRepository;
    private static final Color BRAND_PRIMARY = new Color(33, 37, 41);
    private static final Color BRAND_ACCENT = new Color(108, 99, 255);
    private static final Color TABLE_HEADER_BG = new Color(33, 37, 41);
    private static final Color TABLE_STRIPE_BG = new Color(248, 249, 250);
    private static final Color BORDER_COLOR = new Color(222, 226, 230);
    private static final Color MUTED_TEXT = new Color(108, 117, 125);
    private static final Color SUCCESS_COLOR = new Color(25, 135, 84);
    private static final Color DANGER_COLOR = new Color(220, 53, 69);
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd MMM yyyy");
    private static final DateTimeFormatter DATETIME_FORMAT = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");

    public void createInvoiceForOrder(Order order) {
        if (this.invoiceRepository.existsByOrderId(order.getId())) {
            log.info("Invoice already exists for order {}, skipping creation", order.getId());
            return;
        }
        String invoiceNumber = this.generateInvoiceNumber(order.getId());
        BigDecimal subtotal = this.calculateSubtotal(order);
        BigDecimal shipping = order.getShippingCharges() != null ? order.getShippingCharges() : BigDecimal.ZERO;
        BigDecimal discount = order.getDiscount() != null ? order.getDiscount() : BigDecimal.ZERO;
        BigDecimal tax = order.getTax() != null ? order.getTax() : BigDecimal.ZERO;
        byte[] pdfContent = this.generatePdf(order, invoiceNumber, subtotal, shipping, discount, tax, null);
        Invoice invoice = Invoice.builder().invoiceNumber(invoiceNumber).order(order).subtotal(subtotal).shippingCharges(shipping).discount(discount).tax(tax).totalAmount(order.getTotalAmount()).status(order.getPaymentStatus() == PaymentStatus.COMPLETED ? InvoiceStatus.PAID : InvoiceStatus.UNPAID).pdfContent(pdfContent).issuedAt(LocalDateTime.now()).build();
        this.invoiceRepository.save(invoice);
        log.info("Invoice {} created for order {}", invoiceNumber, order.getId());
    }

    public void voidInvoiceForOrder(Order order) {
        this.invoiceRepository.findByOrderId(order.getId()).ifPresent(invoice -> {
            invoice.setStatus(InvoiceStatus.VOID);
            invoice.setPdfContent(this.generatePdf(order, invoice.getInvoiceNumber(), invoice.getSubtotal(), invoice.getShippingCharges(), invoice.getDiscount(), invoice.getTax(), "CANCELLED"));
            this.invoiceRepository.save(invoice);
            log.info("Invoice {} voided for order {}", invoice.getInvoiceNumber(), order.getId());
        });
    }

    public void markInvoicePaid(Order order) {
        this.invoiceRepository.findByOrderId(order.getId()).ifPresent(invoice -> {
            invoice.setStatus(InvoiceStatus.PAID);
            invoice.setPdfContent(this.generatePdf(order, invoice.getInvoiceNumber(), invoice.getSubtotal(), invoice.getShippingCharges(), invoice.getDiscount(), invoice.getTax(), null));
            this.invoiceRepository.save(invoice);
            log.info("Invoice {} marked paid for order {}", invoice.getInvoiceNumber(), order.getId());
        });
    }

    public void regenerateInvoiceAfterPartialChange(Order order) {
        this.invoiceRepository.findByOrderId(order.getId()).ifPresent(invoice -> {
            BigDecimal newSubtotal = this.calculateActiveSubtotal(order);
            BigDecimal newShipping = order.getShippingCharges() != null ? order.getShippingCharges() : BigDecimal.ZERO;
            BigDecimal discount = order.getDiscount() != null ? order.getDiscount() : BigDecimal.ZERO;
            BigDecimal tax = order.getTax() != null ? order.getTax() : BigDecimal.ZERO;
            BigDecimal totalRefunded = invoice.getSubtotal().add(invoice.getShippingCharges()).subtract(newSubtotal.add(newShipping));
            if (totalRefunded.compareTo(BigDecimal.ZERO) < 0) {
                totalRefunded = BigDecimal.ZERO;
            }
            invoice.setRefundedAmount(totalRefunded);
            invoice.setTotalAmount(order.getTotalAmount());
            boolean allDone = order.getItems().stream().allMatch(i -> i.getItemStatus() == OrderItemStatus.CANCELLED || i.getItemStatus() == OrderItemStatus.RETURNED);
            if (allDone) {
                invoice.setStatus(InvoiceStatus.REFUNDED);
            } else if (totalRefunded.compareTo(BigDecimal.ZERO) > 0) {
                invoice.setStatus(InvoiceStatus.PARTIALLY_REFUNDED);
            }
            invoice.setPdfContent(this.generatePdf(order, invoice.getInvoiceNumber(), invoice.getSubtotal(), invoice.getShippingCharges(), discount, tax, null));
            this.invoiceRepository.save(invoice);
            log.info("Invoice {} regenerated for order {} (refunded: {})", new Object[]{invoice.getInvoiceNumber(), order.getId(), totalRefunded});
        });
    }

    private BigDecimal calculateSubtotal(Order order) {
        return order.getItems().stream().map(OrderItem::getTotalPrice).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal calculateActiveSubtotal(Order order) {
        return order.getItems().stream().filter(i -> i.getItemStatus() == null || i.getItemStatus() == OrderItemStatus.ACTIVE || i.getItemStatus() == OrderItemStatus.RETURN_REQUESTED).map(item -> {
            int effectiveQty = item.getQuantity() - (item.getReturnedQuantity() != null ? item.getReturnedQuantity() : 0);
            if (effectiveQty <= 0) {
                return BigDecimal.ZERO;
            }
            return item.getUnitPrice().multiply(BigDecimal.valueOf(effectiveQty));
        }).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private String generateInvoiceNumber(Long orderId) {
        return String.format("INV-%d-%06d", LocalDateTime.now().getYear(), orderId);
    }

    private byte[] generatePdf(Order order, String invoiceNumber, BigDecimal subtotal, BigDecimal shipping, BigDecimal discount, BigDecimal tax, String watermark) {
        byte[] byArray;
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try {
            Document doc = new Document(PageSize.A4, 40.0f, 40.0f, 50.0f, 50.0f);
            PdfWriter writer = PdfWriter.getInstance((Document)doc, (OutputStream)out);
            doc.open();
            if (watermark != null) {
                this.addWatermark(writer, watermark);
            }
            this.addHeader(doc, invoiceNumber, order);
            this.addSeparator(doc);
            this.addBillingSection(doc, order);
            this.addItemsTable(doc, order);
            this.addTotalsSection(doc, order, subtotal, shipping, discount, tax);
            this.addPaymentInfo(doc, order);
            this.addFooter(doc);
            doc.close();
            byArray = out.toByteArray();
        }
        catch (Throwable throwable) {
            try {
                try {
                    out.close();
                }
                catch (Throwable throwable2) {
                    throwable.addSuppressed(throwable2);
                }
                throw throwable;
            }
            catch (Exception e) {
                log.error("Error generating invoice PDF for order {}", order.getId(), e);
                throw new RuntimeException("Failed to generate invoice PDF", e);
            }
        }
        try {
            out.close();
        }
        catch (Exception e) {
            // ignore
        }
        return byArray;
    }

    private void addWatermark(PdfWriter writer, String text) {
        PdfContentByte canvas = writer.getDirectContentUnder();
        Font watermarkFont = FontFactory.getFont((String)"Helvetica-Bold", (float)72.0f, (Color)new Color(230, 230, 230));
        Phrase phrase = new Phrase(text, watermarkFont);
        float x = PageSize.A4.getWidth() / 2.0f;
        float y = PageSize.A4.getHeight() / 2.0f;
        ColumnText.showTextAligned((PdfContentByte)canvas, (int)1, (Phrase)phrase, (float)x, (float)y, (float)45.0f);
    }

    private void addHeader(Document doc, String invoiceNumber, Order order) throws DocumentException {
        PdfPTable header = new PdfPTable(2);
        header.setWidthPercentage(100.0f);
        header.setWidths(new float[]{60.0f, 40.0f});
        PdfPCell leftCell = new PdfPCell();
        leftCell.setBorder(0);
        leftCell.setPaddingBottom(10.0f);
        Font brandFont = FontFactory.getFont((String)"Helvetica-Bold", (float)26.0f, (Color)BRAND_PRIMARY);
        Paragraph brand = new Paragraph("STYLISTE", brandFont);
        leftCell.addElement((Element)brand);
        Font taglineFont = FontFactory.getFont((String)"Helvetica", (float)9.0f, (Color)MUTED_TEXT);
        Paragraph tagline = new Paragraph("Premium Fashion & Designer Wear", taglineFont);
        leftCell.addElement((Element)tagline);
        header.addCell(leftCell);
        PdfPCell rightCell = new PdfPCell();
        rightCell.setBorder(0);
        rightCell.setHorizontalAlignment(2);
        rightCell.setPaddingBottom(10.0f);
        Font titleFont = FontFactory.getFont((String)"Helvetica-Bold", (float)18.0f, (Color)BRAND_ACCENT);
        Paragraph title = new Paragraph("TAX INVOICE", titleFont);
        title.setAlignment(2);
        rightCell.addElement((Element)title);
        Font metaFont = FontFactory.getFont((String)"Helvetica", (float)9.0f, (Color)MUTED_TEXT);
        Font metaValueFont = FontFactory.getFont((String)"Helvetica-Bold", (float)9.0f, (Color)BRAND_PRIMARY);
        Paragraph invNum = new Paragraph();
        invNum.setAlignment(2);
        invNum.add((Element)new Chunk("Invoice No: ", metaFont));
        invNum.add((Element)new Chunk(invoiceNumber, metaValueFont));
        rightCell.addElement((Element)invNum);
        Paragraph invDate = new Paragraph();
        invDate.setAlignment(2);
        invDate.add((Element)new Chunk("Date: ", metaFont));
        invDate.add((Element)new Chunk(LocalDateTime.now().format(DATE_FORMAT), metaValueFont));
        rightCell.addElement((Element)invDate);
        Paragraph orderNum = new Paragraph();
        orderNum.setAlignment(2);
        orderNum.add((Element)new Chunk("Order: ", metaFont));
        orderNum.add((Element)new Chunk("#" + order.getId(), metaValueFont));
        rightCell.addElement((Element)orderNum);
        InvoiceStatus status = this.determineDisplayStatus(order);
        Font statusFont = FontFactory.getFont((String)"Helvetica-Bold", (float)10.0f, (Color)(status == InvoiceStatus.PAID ? SUCCESS_COLOR : (status == InvoiceStatus.VOID ? DANGER_COLOR : MUTED_TEXT)));
        Paragraph statusPara = new Paragraph(status.name(), statusFont);
        statusPara.setAlignment(2);
        statusPara.setSpacingBefore(4.0f);
        rightCell.addElement((Element)statusPara);
        header.addCell(rightCell);
        doc.add((Element)header);
    }

    private InvoiceStatus determineDisplayStatus(Order order) {
        Optional existing = this.invoiceRepository.findByOrderId(order.getId());
        if (existing.isPresent()) {
            return ((Invoice)existing.get()).getStatus();
        }
        return order.getPaymentStatus() == PaymentStatus.COMPLETED ? InvoiceStatus.PAID : InvoiceStatus.UNPAID;
    }

    private void addSeparator(Document doc) throws DocumentException {
        PdfPTable line = new PdfPTable(1);
        line.setWidthPercentage(100.0f);
        line.setSpacingBefore(5.0f);
        line.setSpacingAfter(10.0f);
        PdfPCell cell = new PdfPCell();
        cell.setBorderWidthTop(2.0f);
        cell.setBorderColorTop(BRAND_ACCENT);
        cell.setBorderWidthBottom(0.0f);
        cell.setBorderWidthLeft(0.0f);
        cell.setBorderWidthRight(0.0f);
        cell.setFixedHeight(1.0f);
        line.addCell(cell);
        doc.add((Element)line);
    }

    private void addBillingSection(Document doc, Order order) throws DocumentException {
        PdfPTable billing = new PdfPTable(2);
        billing.setWidthPercentage(100.0f);
        billing.setWidths(new float[]{50.0f, 50.0f});
        billing.setSpacingAfter(15.0f);
        Font labelFont = FontFactory.getFont((String)"Helvetica-Bold", (float)10.0f, (Color)BRAND_ACCENT);
        Font valueFont = FontFactory.getFont((String)"Helvetica", (float)9.0f, (Color)BRAND_PRIMARY);
        PdfPCell billTo = new PdfPCell();
        billTo.setBorder(0);
        billTo.setPadding(8.0f);
        billTo.setBackgroundColor(TABLE_STRIPE_BG);
        billTo.addElement((Element)new Paragraph("BILL TO", labelFont));
        billTo.addElement((Element)new Paragraph(order.getUser().getName(), FontFactory.getFont((String)"Helvetica-Bold", (float)11.0f, (Color)BRAND_PRIMARY)));
        billTo.addElement((Element)new Paragraph(order.getUser().getEmail(), valueFont));
        if (order.getUserPhone() != null) {
            billTo.addElement((Element)new Paragraph("Phone: " + order.getUserPhone(), valueFont));
        }
        billing.addCell(billTo);
        PdfPCell shipTo = new PdfPCell();
        shipTo.setBorder(0);
        shipTo.setPadding(8.0f);
        shipTo.setBackgroundColor(TABLE_STRIPE_BG);
        shipTo.addElement((Element)new Paragraph("SHIP TO", labelFont));
        String address = order.getShippingAddress();
        if (address != null) {
            String[] parts;
            for (String part : parts = address.split(",")) {
                shipTo.addElement((Element)new Paragraph(part.trim(), valueFont));
            }
        }
        billing.addCell(shipTo);
        doc.add((Element)billing);
    }

    private void addItemsTable(Document doc, Order order) throws DocumentException {
        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100.0f);
        table.setSpacingBefore(5.0f);
        table.setWidths(new float[]{5.0f, 25.0f, 10.0f, 8.0f, 10.0f, 10.0f});
        String[] headers = new String[]{"#", "Item Description", "Size / Color", "Qty", "Unit Price", "Total"};
        Font headerFont = FontFactory.getFont((String)"Helvetica-Bold", (float)9.0f, (Color)Color.WHITE);
        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
            cell.setBackgroundColor(TABLE_HEADER_BG);
            cell.setPadding(8.0f);
            cell.setBorderWidth(0.0f);
            cell.setHorizontalAlignment(h.equals("Item Description") || h.equals("Size / Color") ? 0 : 1);
            table.addCell(cell);
        }
        Font itemFont = FontFactory.getFont((String)"Helvetica", (float)9.0f, (Color)BRAND_PRIMARY);
        Font mutedSmall = FontFactory.getFont((String)"Helvetica", (float)8.0f, (Color)MUTED_TEXT);
        Font strikeFont = FontFactory.getFont((String)"Helvetica", (float)9.0f, (Color)MUTED_TEXT);
        int serial = 1;
        for (OrderItem item : order.getItems()) {
            boolean isCancelled = item.getItemStatus() == OrderItemStatus.CANCELLED;
            boolean isReturned = item.getItemStatus() == OrderItemStatus.RETURNED;
            boolean hasPartialReturn = item.getReturnedQuantity() != null && item.getReturnedQuantity() > 0 && !isReturned;
            Color rowBg = serial % 2 == 0 ? TABLE_STRIPE_BG : Color.WHITE;
            Font rowFont = isCancelled || isReturned ? strikeFont : itemFont;
            PdfPCell numCell = this.createItemCell(String.valueOf(serial), rowFont, rowBg, 1);
            table.addCell(numCell);
            PdfPCell nameCell = new PdfPCell();
            nameCell.setBackgroundColor(rowBg);
            nameCell.setPadding(6.0f);
            nameCell.setBorderWidth(0.5f);
            nameCell.setBorderColor(BORDER_COLOR);
            Paragraph namePara = new Paragraph(item.getProduct().getName(), rowFont);
            nameCell.addElement((Element)namePara);
            if (isCancelled) {
                nameCell.addElement((Element)new Paragraph("CANCELLED", FontFactory.getFont((String)"Helvetica-Bold", (float)7.0f, (Color)DANGER_COLOR)));
            } else if (isReturned) {
                nameCell.addElement((Element)new Paragraph("RETURNED", FontFactory.getFont((String)"Helvetica-Bold", (float)7.0f, (Color)DANGER_COLOR)));
            } else if (hasPartialReturn) {
                nameCell.addElement((Element)new Paragraph(item.getReturnedQuantity() + " returned", FontFactory.getFont((String)"Helvetica", (float)7.0f, (Color)MUTED_TEXT)));
            }
            table.addCell(nameCell);
            Object sizeColor = "";
            if (item.getSelectedSize() != null) {
                sizeColor = (String)sizeColor + item.getSelectedSize();
            }
            if (item.getSelectedColor() != null) {
                if (!((String)sizeColor).isEmpty()) {
                    sizeColor = (String)sizeColor + " / ";
                }
                sizeColor = (String)sizeColor + item.getSelectedColor();
            }
            table.addCell(this.createItemCell((String)(((String)sizeColor).isEmpty() ? "-" : sizeColor), mutedSmall, rowBg, 0));
            String qtyStr = String.valueOf(item.getQuantity());
            table.addCell(this.createItemCell(qtyStr, rowFont, rowBg, 1));
            table.addCell(this.createItemCell(this.formatCurrency(item.getUnitPrice()), rowFont, rowBg, 2));
            BigDecimal lineTotal = item.getTotalPrice();
            if (isCancelled || isReturned) {
                PdfPCell totalCell = new PdfPCell();
                totalCell.setBackgroundColor(rowBg);
                totalCell.setPadding(6.0f);
                totalCell.setBorderWidth(0.5f);
                totalCell.setBorderColor(BORDER_COLOR);
                totalCell.setHorizontalAlignment(2);
                Paragraph strikePara = new Paragraph(this.formatCurrency(lineTotal), strikeFont);
                strikePara.setAlignment(2);
                totalCell.addElement((Element)strikePara);
                Paragraph zeroPara = new Paragraph(this.formatCurrency(BigDecimal.ZERO), FontFactory.getFont((String)"Helvetica-Bold", (float)9.0f, (Color)DANGER_COLOR));
                zeroPara.setAlignment(2);
                totalCell.addElement((Element)zeroPara);
                table.addCell(totalCell);
            } else {
                table.addCell(this.createItemCell(this.formatCurrency(lineTotal), rowFont, rowBg, 2));
            }
            ++serial;
        }
        doc.add((Element)table);
    }

    private PdfPCell createItemCell(String text, Font font, Color bg, int align) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBackgroundColor(bg);
        cell.setPadding(6.0f);
        cell.setBorderWidth(0.5f);
        cell.setBorderColor(BORDER_COLOR);
        cell.setHorizontalAlignment(align);
        cell.setVerticalAlignment(5);
        return cell;
    }

    private void addTotalsSection(Document doc, Order order, BigDecimal subtotal, BigDecimal shipping, BigDecimal discount, BigDecimal tax) throws DocumentException {
        BigDecimal refunded;
        PdfPTable totalsWrapper = new PdfPTable(2);
        totalsWrapper.setWidthPercentage(100.0f);
        totalsWrapper.setWidths(new float[]{55.0f, 45.0f});
        totalsWrapper.setSpacingBefore(10.0f);
        PdfPCell leftCell = new PdfPCell();
        leftCell.setBorder(0);
        totalsWrapper.addCell(leftCell);
        PdfPCell rightCell = new PdfPCell();
        rightCell.setBorder(0);
        PdfPTable totals = new PdfPTable(2);
        totals.setWidthPercentage(100.0f);
        totals.setWidths(new float[]{60.0f, 40.0f});
        Font labelFont = FontFactory.getFont((String)"Helvetica", (float)9.0f, (Color)MUTED_TEXT);
        Font valueFont = FontFactory.getFont((String)"Helvetica", (float)9.0f, (Color)BRAND_PRIMARY);
        Font totalLabel = FontFactory.getFont((String)"Helvetica-Bold", (float)11.0f, (Color)BRAND_PRIMARY);
        Font totalValue = FontFactory.getFont((String)"Helvetica-Bold", (float)11.0f, (Color)BRAND_ACCENT);
        this.addTotalRow(totals, "Subtotal", this.formatCurrency(subtotal), labelFont, valueFont);
        if (shipping.compareTo(BigDecimal.ZERO) > 0) {
            this.addTotalRow(totals, "Shipping", this.formatCurrency(shipping), labelFont, valueFont);
        } else {
            this.addTotalRow(totals, "Shipping", "FREE", labelFont, FontFactory.getFont((String)"Helvetica-Bold", (float)9.0f, (Color)SUCCESS_COLOR));
        }
        if (discount != null && discount.compareTo(BigDecimal.ZERO) > 0) {
            this.addTotalRow(totals, "Discount", "- " + this.formatCurrency(discount), labelFont, FontFactory.getFont((String)"Helvetica", (float)9.0f, (Color)SUCCESS_COLOR));
        }
        if (tax != null && tax.compareTo(BigDecimal.ZERO) > 0) {
            this.addTotalRow(totals, "Tax", this.formatCurrency(tax), labelFont, valueFont);
        }
        PdfPCell sepLeft = new PdfPCell();
        sepLeft.setBorderWidthTop(1.0f);
        sepLeft.setBorderColorTop(BORDER_COLOR);
        sepLeft.setBorderWidthBottom(0.0f);
        sepLeft.setBorderWidthLeft(0.0f);
        sepLeft.setBorderWidthRight(0.0f);
        sepLeft.setFixedHeight(8.0f);
        totals.addCell(sepLeft);
        PdfPCell sepRight = new PdfPCell();
        sepRight.setBorderWidthTop(1.0f);
        sepRight.setBorderColorTop(BORDER_COLOR);
        sepRight.setBorderWidthBottom(0.0f);
        sepRight.setBorderWidthLeft(0.0f);
        sepRight.setBorderWidthRight(0.0f);
        sepRight.setFixedHeight(8.0f);
        totals.addCell(sepRight);
        this.addTotalRow(totals, "GRAND TOTAL", this.formatCurrency(order.getTotalAmount()), totalLabel, totalValue);
        Optional existingInvoice = this.invoiceRepository.findByOrderId(order.getId());
        if (existingInvoice.isPresent() && (refunded = ((Invoice)existingInvoice.get()).getRefundedAmount()) != null && refunded.compareTo(BigDecimal.ZERO) > 0) {
            this.addTotalRow(totals, "Refunded", "- " + this.formatCurrency(refunded), FontFactory.getFont((String)"Helvetica-Bold", (float)9.0f, (Color)DANGER_COLOR), FontFactory.getFont((String)"Helvetica-Bold", (float)9.0f, (Color)DANGER_COLOR));
        }
        rightCell.addElement((Element)totals);
        totalsWrapper.addCell(rightCell);
        doc.add((Element)totalsWrapper);
    }

    private void addTotalRow(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, labelFont));
        labelCell.setBorder(0);
        labelCell.setPadding(3.0f);
        labelCell.setHorizontalAlignment(0);
        table.addCell(labelCell);
        PdfPCell valueCell = new PdfPCell(new Phrase(value, valueFont));
        valueCell.setBorder(0);
        valueCell.setPadding(3.0f);
        valueCell.setHorizontalAlignment(2);
        table.addCell(valueCell);
    }

    private void addPaymentInfo(Document doc, Order order) throws DocumentException {
        PdfPTable payBox = new PdfPTable(1);
        payBox.setWidthPercentage(100.0f);
        payBox.setSpacingBefore(15.0f);
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(TABLE_STRIPE_BG);
        cell.setPadding(10.0f);
        cell.setBorderWidth(0.5f);
        cell.setBorderColor(BORDER_COLOR);
        Font labelFont = FontFactory.getFont((String)"Helvetica-Bold", (float)9.0f, (Color)BRAND_ACCENT);
        Font valueFont = FontFactory.getFont((String)"Helvetica", (float)9.0f, (Color)BRAND_PRIMARY);
        cell.addElement((Element)new Paragraph("PAYMENT DETAILS", labelFont));
        String methodStr = order.getPaymentMethod() == PaymentMethod.COD ? "Cash on Delivery" : "Online Payment (Razorpay)";
        cell.addElement((Element)new Paragraph("Method: " + methodStr, valueFont));
        String payStatusStr = switch (order.getPaymentStatus()) {
            case COMPLETED -> "Paid";
            case PENDING -> "Pending";
            case FAILED -> "Failed";
            case REFUNDED -> "Refunded";
        };
        cell.addElement((Element)new Paragraph("Payment Status: " + payStatusStr, valueFont));
        if (order.getRazorpayPaymentId() != null) {
            cell.addElement((Element)new Paragraph("Transaction ID: " + order.getRazorpayPaymentId(), valueFont));
        }
        if (order.getCreatedAt() != null) {
            cell.addElement((Element)new Paragraph("Order Date: " + order.getCreatedAt().format(DATETIME_FORMAT), valueFont));
        }
        payBox.addCell(cell);
        doc.add((Element)payBox);
    }

    private void addFooter(Document doc) throws DocumentException {
        Paragraph spacer = new Paragraph(" ");
        spacer.setSpacingBefore(20.0f);
        doc.add((Element)spacer);
        PdfPTable footer = new PdfPTable(1);
        footer.setWidthPercentage(100.0f);
        PdfPCell line = new PdfPCell();
        line.setBorderWidthTop(1.0f);
        line.setBorderColorTop(BORDER_COLOR);
        line.setBorderWidthBottom(0.0f);
        line.setBorderWidthLeft(0.0f);
        line.setBorderWidthRight(0.0f);
        line.setFixedHeight(1.0f);
        footer.addCell(line);
        Font footerFont = FontFactory.getFont((String)"Helvetica", (float)8.0f, (Color)MUTED_TEXT);
        PdfPCell thankYou = new PdfPCell();
        thankYou.setBorder(0);
        thankYou.setPaddingTop(8.0f);
        thankYou.setHorizontalAlignment(1);
        Paragraph thanks = new Paragraph("Thank you for shopping with Styliste!", FontFactory.getFont((String)"Helvetica-Bold", (float)10.0f, (Color)BRAND_ACCENT));
        thanks.setAlignment(1);
        thankYou.addElement((Element)thanks);
        Paragraph note = new Paragraph("This is a computer-generated invoice and does not require a signature.\nFor queries, contact us at support@styliste.com", footerFont);
        note.setAlignment(1);
        thankYou.addElement((Element)note);
        footer.addCell(thankYou);
        doc.add((Element)footer);
    }

    private String formatCurrency(BigDecimal amount) {
        if (amount == null) {
            return "Rs. 0.00";
        }
        return "Rs. " + amount.setScale(2, RoundingMode.HALF_UP).toPlainString();
    }
}

