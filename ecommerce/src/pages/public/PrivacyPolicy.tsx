// import { Footer } from "../../components/layout/Footer";
// import Navbar from "../../components/layout/Navbar";

import { Footer } from "../../components/layout/Footer";
import Navbar from "../../components/layout/Navbar";

// const PrivacyPolicy = () => {
//   return (
//     <div className="bg-background py-24">
//       <div className="container mx-auto px-6 max-w-4xl">
//         <Navbar />
       
//         {/* Page Title */}
//         <h1 className="font-serif text-4xl md:text-5xl text-center mb-2">
//           Privacy Policy
//         </h1>
//         <p className="text-center text-muted-foreground mb-12">
//           Effective Date: January 06, 2026
//         </p>

//         {/* Policy Card */}
//         <div className="bg-card border border-border rounded-lg p-8 md:p-12 text-sm leading-relaxed text-muted-foreground space-y-6">

//           <p>
//             This Privacy Policy is issued in compliance with the Information Technology Act, 2000, and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
//           </p>

//           <h2 className="font-semibold text-foreground">Privacy Policy</h2>

//           <div>
//             <strong>1. Collection of Information</strong>
//             <p>
//               The Company may collect personal, identity, and financial information as mandated under RBI, FEMA, and AML regulations.
//             </p>
//           </div>

//           <div>
//             <strong>2. Sensitive Personal Data</strong>
//             <p>
//               Information collected may include PAN, Aadhaar (where legally permitted), passport details, travel documents, and bank account details.
//             </p>
//           </div>

//           <div>
//             <strong>3. Purpose Limitation</strong>
//             <p>
//               Data is collected strictly for regulatory compliance, transaction processing, record maintenance, and lawful business purposes.
//             </p>
//           </div>

//           <div>
//             <strong>4. Consent</strong>
//             <p>
//               By using the Website, the User provides explicit consent for data collection and processing.
//             </p>
//           </div>

//           <div>
//             <strong>5. Data Storage</strong>
//             <p>
//               Personal data is securely stored in accordance with reasonable security practices as prescribed under Indian law.
//             </p>
//           </div>

//           <div>
//             <strong>6. Data Retention</strong>
//             <p>
//               Data shall be retained for the period mandated under FEMA, RBI, and PMLA regulations.
//             </p>
//           </div>

//           <div>
//             <strong>7. Disclosure to Authorities</strong>
//             <p>
//               Information may be disclosed to RBI, enforcement agencies, or statutory authorities as required by law.
//             </p>
//           </div>

//           <div>
//             <strong>8. Third-Party Processors</strong>
//             <p>
//               Payment gateways and verification agencies may process data subject to their own privacy policies.
//             </p>
//           </div>

//           <div>
//             <strong>9. Prohibition on Sale of Data</strong>
//             <p>
//               The Company does not sell or trade personal data.
//             </p>
//           </div>

//           <div>
//             <strong>10. Data Security Measures</strong>
//             <p>
//               Adequate administrative, technical, and physical safeguards are implemented.
//             </p>
//           </div>

//           <div>
//             <strong>11. User Rights</strong>
//             <p>
//               Users may seek access or correction of data subject to legal and regulatory limitations.
//             </p>
//           </div>

//           <div>
//             <strong>12. Confidentiality</strong>
//             <p>
//               All personal data is treated as confidential.
//             </p>
//           </div>

//           <div>
//             <strong>13. Breach Reporting</strong>
//             <p>
//               In the event of a data breach, appropriate steps shall be taken as per applicable law.
//             </p>
//           </div>

//           <div>
//             <strong>14. Cookies</strong>
//             <p>
//               Cookies may be used to enhance user experience and Website functionality.
//             </p>
//           </div>

//           <div>
//             <strong>15. Children’s Data</strong>
//             <p>
//               Data of minors is processed only through legal guardians.
//             </p>
//           </div>

//           <div>
//             <strong>16. External Links</strong>
//             <p>
//               The Company is not responsible for third-party websites.
//             </p>
//           </div>

//           <div>
//             <strong>17. Grievance Redressal</strong>
//             <p>
//               Users may raise privacy-related grievances through the contact details available on the Website.
//             </p>
//           </div>

//           <div>
//             <strong>18. Policy Updates</strong>
//             <p>
//               This Policy may be updated periodically to reflect regulatory changes.
//             </p>
//           </div>

//           <div>
//             <strong>19. Notification of Changes</strong>
//             <p>
//               Revised policies shall be effective upon publication on the Website.
//             </p>
//           </div>

//           <div>
//             <strong>20. Governing Law</strong>
//             <p>
//               This Privacy Policy shall be governed by the laws of India.
//             </p>
//           </div>

//         </div>
        
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default PrivacyPolicy;


const PrivacyPolicy = () => {
  return (
    <div className="bg-background py-24">
<Navbar />
      {/* ================= PAGE HEADING ================= */}
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="font-serif text-4xl md:text-5xl text-center mb-2 text-foreground">
          Privacy Policy
        </h1>

        <p className="text-center text-muted-foreground mb-14">
          Effective Date: January 06, 2026
        </p>
      </div>

      {/* ================= FULL WIDTH HR ================= */}
      <hr className="w-full border-border mb-12" />

      {/* ================= CONTENT ================= */}
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-card rounded-lg p-8 md:p-12 text-sm leading-relaxed text-muted-foreground space-y-6">

          <p>
            This Privacy Policy is issued in compliance with the Information Technology Act, 2000, and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
          </p>

          <h2 className="font-semibold text-sage text-lg">
            Privacy Policy
          </h2>

          <div>
            <p className="font-semibold text-sage mb-1">
              1. Collection of Information
            </p>
            <p>
              The Company may collect personal, identity, and financial information as mandated under RBI, FEMA, and AML regulations.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sage mb-1">
              2. Sensitive Personal Data
            </p>
            <p>
              Information collected may include PAN, Aadhaar (where legally permitted), passport details, travel documents, and bank account details.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sage mb-1">
              3. Purpose Limitation
            </p>
            <p>
              Data is collected strictly for regulatory compliance, transaction processing, record maintenance, and lawful business purposes.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sage mb-1">
              4. Consent
            </p>
            <p>
              By using the Website, the User provides explicit consent for data collection and processing.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sage mb-1">
              5. Data Storage
            </p>
            <p>
              Personal data is securely stored in accordance with reasonable security practices as prescribed under Indian law.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sage mb-1">
              6. Data Retention
            </p>
            <p>
              Data shall be retained for the period mandated under FEMA, RBI, and PMLA regulations.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sage mb-1">
              7. Disclosure to Authorities
            </p>
            <p>
              Information may be disclosed to RBI, enforcement agencies, or statutory authorities as required by law.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sage mb-1">
              8. Third-Party Processors
            </p>
            <p>
              Payment gateways and verification agencies may process data subject to their own privacy policies.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sage mb-1">
              9. Prohibition on Sale of Data
            </p>
            <p>
              The Company does not sell or trade personal data.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sage mb-1">
              10. Data Security Measures
            </p>
            <p>
              Adequate administrative, technical, and physical safeguards are implemented.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sage mb-1">
              11. User Rights
            </p>
            <p>
              Users may seek access or correction of data subject to legal and regulatory limitations.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sage mb-1">
              12. Confidentiality
            </p>
            <p>
              All personal data is treated as confidential.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sage mb-1">
              13. Breach Reporting
            </p>
            <p>
              In the event of a data breach, appropriate steps shall be taken as per applicable law.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sage mb-1">
              14. Cookies
            </p>
            <p>
              Cookies may be used to enhance user experience and Website functionality.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sage mb-1">
              15. Children’s Data
            </p>
            <p>
              Data of minors is processed only through legal guardians.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sage mb-1">
              16. External Links
            </p>
            <p>
              The Company is not responsible for third-party websites.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sage mb-1">
              17. Grievance Redressal
            </p>
            <p>
              Users may raise privacy-related grievances through the contact details available on the Website.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sage mb-1">
              18. Policy Updates
            </p>
            <p>
              This Policy may be updated periodically to reflect regulatory changes.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sage mb-1">
              19. Notification of Changes
            </p>
            <p>
              Revised policies shall be effective upon publication on the Website.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sage mb-1">
              20. Governing Law
            </p>
            <p>
              This Privacy Policy shall be governed by the laws of India.
            </p>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
