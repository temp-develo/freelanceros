'use client';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Proposal, ProposalSection, ProposalItem } from '@/types/proposals';

interface PDFGenerationOptions {
  filename?: string;
  includeHeader?: boolean;
  includeFooter?: boolean;
  includeWatermark?: boolean;
}

export async function generateProposalPDF(
  proposal: Proposal,
  options: PDFGenerationOptions = {}
): Promise<void> {
  const {
    filename = `Proposal_${proposal.title.replace(/\s+/g, '_')}.pdf`,
    includeHeader = true,
    includeFooter = true,
    includeWatermark = false
  } = options;

  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Set document properties
  doc.setProperties({
    title: `Proposal: ${proposal.title}`,
    subject: `Proposal for ${proposal.clientName}`,
    creator: 'FreelancerOS',
    author: 'FreelancerOS'
  });

  // Document dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  // Colors
  const primaryColor = '#4385be'; // blue-light
  const textColor = '#100f0f'; // base-black
  const secondaryTextColor = '#575653'; // base-700

  // Add header
  let yPosition = margin;
  if (includeHeader) {
    // Add logo or header image
    // doc.addImage(logoBase64, 'PNG', margin, yPosition, 40, 15);
    
    // Add proposal title
    yPosition += 20;
    doc.setFontSize(24);
    doc.setTextColor(primaryColor);
    doc.text(proposal.title, margin, yPosition);
    
    // Add date and reference
    yPosition += 10;
    doc.setFontSize(10);
    doc.setTextColor(secondaryTextColor);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, yPosition);
    doc.text(`Ref: ${proposal.id.substring(0, 8)}`, pageWidth - margin - 30, yPosition);
    
    // Add separator line
    yPosition += 5;
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    
    yPosition += 10;
  }

  // Add client information
  doc.setFontSize(12);
  doc.setTextColor(textColor);
  doc.text('CLIENT', margin, yPosition);
  
  yPosition += 7;
  doc.setFontSize(14);
  doc.text(proposal.clientName, margin, yPosition);
  
  // Add proposal details
  yPosition += 15;
  doc.setFontSize(12);
  doc.setTextColor(textColor);
  doc.text('PROPOSAL DETAILS', margin, yPosition);
  
  yPosition += 7;
  doc.setFontSize(10);
  doc.text(`Status: ${proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}`, margin, yPosition);
  
  yPosition += 5;
  if (proposal.validUntil) {
    doc.text(`Valid Until: ${new Date(proposal.validUntil).toLocaleDateString()}`, margin, yPosition);
    yPosition += 5;
  }
  
  doc.text(`Amount: ${formatCurrency(proposal.amount, proposal.currency)}`, margin, yPosition);
  
  // Add description
  if (proposal.description) {
    yPosition += 15;
    doc.setFontSize(12);
    doc.setTextColor(textColor);
    doc.text('DESCRIPTION', margin, yPosition);
    
    yPosition += 7;
    doc.setFontSize(10);
    
    // Handle multi-line description
    const splitDescription = doc.splitTextToSize(proposal.description, contentWidth);
    doc.text(splitDescription, margin, yPosition);
    
    yPosition += splitDescription.length * 5 + 5;
  }

  // Add sections
  if (proposal.sections && proposal.sections.length > 0) {
    for (const section of proposal.sections) {
      // Check if we need a new page
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = margin;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(primaryColor);
      doc.text(section.title, margin, yPosition);
      
      yPosition += 7;
      
      if (section.content) {
        doc.setFontSize(10);
        doc.setTextColor(textColor);
        
        // Handle multi-line content
        const splitContent = doc.splitTextToSize(section.content, contentWidth);
        doc.text(splitContent, margin, yPosition);
        
        yPosition += splitContent.length * 5 + 10;
      }
    }
  }

  // Add items table
  if (proposal.items && proposal.items.length > 0) {
    // Check if we need a new page
    if (yPosition > pageHeight - 70) {
      doc.addPage();
      yPosition = margin;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(textColor);
    doc.text('PRICING', margin, yPosition);
    
    yPosition += 10;
    
    // Table headers
    const headers = ['Description', 'Quantity', 'Unit Price', 'Amount'];
    const columnWidths = [contentWidth * 0.5, contentWidth * 0.15, contentWidth * 0.15, contentWidth * 0.2];
    
    doc.setFillColor(primaryColor);
    doc.setTextColor(255, 255, 255);
    doc.rect(margin, yPosition - 5, contentWidth, 7, 'F');
    
    let xPosition = margin;
    for (let i = 0; i < headers.length; i++) {
      doc.text(headers[i], xPosition + 2, yPosition);
      xPosition += columnWidths[i];
    }
    
    yPosition += 7;
    doc.setTextColor(textColor);
    
    // Table rows
    for (const item of proposal.items) {
      // Check if we need a new page
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = margin;
        
        // Redraw headers on new page
        doc.setFillColor(primaryColor);
        doc.setTextColor(255, 255, 255);
        doc.rect(margin, yPosition - 5, contentWidth, 7, 'F');
        
        xPosition = margin;
        for (let i = 0; i < headers.length; i++) {
          doc.text(headers[i], xPosition + 2, yPosition);
          xPosition += columnWidths[i];
        }
        
        yPosition += 7;
        doc.setTextColor(textColor);
      }
      
      // Alternate row background
      if (proposal.items.indexOf(item) % 2 === 1) {
        doc.setFillColor(240, 240, 240);
        doc.rect(margin, yPosition - 5, contentWidth, 7, 'F');
      }
      
      // Item data
      xPosition = margin;
      
      // Description
      const description = doc.splitTextToSize(item.description, columnWidths[0] - 4);
      doc.text(description, xPosition + 2, yPosition);
      
      // Quantity
      xPosition += columnWidths[0];
      doc.text(item.quantity.toString(), xPosition + 2, yPosition);
      
      // Unit Price
      xPosition += columnWidths[1];
      doc.text(formatCurrency(item.unitPrice, proposal.currency, false), xPosition + 2, yPosition);
      
      // Amount
      xPosition += columnWidths[2];
      doc.text(formatCurrency(item.amount, proposal.currency, false), xPosition + 2, yPosition);
      
      yPosition += Math.max(description.length * 5, 7);
    }
    
    // Total row
    yPosition += 2;
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    
    yPosition += 7;
    doc.setFontSize(12);
    doc.setTextColor(primaryColor);
    doc.text('TOTAL', margin, yPosition);
    
    doc.text(
      formatCurrency(proposal.amount, proposal.currency),
      pageWidth - margin - doc.getTextWidth(formatCurrency(proposal.amount, proposal.currency)),
      yPosition
    );
  }

  // Add footer
  if (includeFooter) {
    // Add to all pages
    const totalPages = doc.getNumberOfPages();
    
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
      const footerY = pageHeight - 10;
      
      doc.setFontSize(8);
      doc.setTextColor(secondaryTextColor);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, footerY);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 25, footerY);
    }
  }

  // Add watermark if needed
  if (includeWatermark) {
    const totalPages = doc.getNumberOfPages();
    
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
      doc.setFontSize(60);
      doc.setTextColor(230, 230, 230);
      doc.setFont('helvetica', 'bold');
      
      const watermarkText = 'DRAFT';
      const textWidth = doc.getTextWidth(watermarkText);
      
      // Rotate and position the watermark
      doc.saveGraphicsState();
      doc.translate(pageWidth / 2, pageHeight / 2);
      doc.rotate(-45);
      doc.text(watermarkText, -textWidth / 2, 0);
      doc.restoreGraphicsState();
    }
  }

  // Save the PDF
  doc.save(filename);
}

// Helper function to format currency
function formatCurrency(amount: number, currency: string = 'USD', includeSymbol: boolean = true): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: includeSymbol ? 'currency' : 'decimal',
    currency: currency,
    minimumFractionDigits: 2
  });
  
  return formatter.format(amount);
}