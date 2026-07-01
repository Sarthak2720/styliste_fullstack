import { Footer } from "../../components/layout/Footer";
import Navbar from "../../components/layout/Navbar";

const RefundPolicy = () => {
  return (
    <div className="bg-background py-24">
<Navbar />
      {/* ================= PAGE HEADING ================= */}
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="font-serif text-4xl md:text-5xl text-center mb-2 text-foreground">
          Refund & Cancellation Policy
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
            This Refund & Cancellation Policy forms an integral part of the Terms & Conditions of www.jbforex.in and shall be read in conjunction with applicable laws including the Foreign Exchange Management Act, 1999 (FEMA), RBI Master Directions, and other statutory regulations.
          </p>

          {/* Inner Title */}
          <h2 className="font-semibold text-sage text-lg">
            Refund & Cancellation Policy
          </h2>

          <div>
            <p className="font-semibold text-sage mb-1">
              1. No General Right of Cancellation
            </p>
            <p>
              Foreign exchange transactions, once booked or executed, are generally irreversible in nature. Accordingly, cancellation requests shall be entertained strictly at the sole discretion of the Company and subject to regulatory feasibility.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sage mb-1">
              2. Cancellation Before Execution
            </p>
            <p>
              If a cancellation request is received before the foreign exchange transaction is executed, the Company may, at its discretion, cancel the transaction after deducting applicable administrative charges, bank charges, and forex rate differences, if any.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sage mb-1">
              3. Post-Execution Cancellation
            </p>
            <p>
              Once the foreign exchange has been delivered, loaded, issued, or executed, no cancellation or refund shall be permitted under any circumstances, except where mandated by law.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sage mb-1">
              4. Refund Mode
            </p>
            <p>
              All approved refunds shall be processed strictly to the same bank account from which the original payment was made, in compliance with RBI and AML guidelines. Cash refunds are strictly prohibited.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sage mb-1">
              5. Refund Timeline
            </p>
            <p>
              Approved refunds shall be processed within 7–10 working days, subject to banking and regulatory clearances.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sage mb-1">
              6. Rate Difference and Charges
            </p>
            <p>
              Any refund processed shall be subject to prevailing exchange rate differences, service charges, bank fees, taxes, and statutory levies.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sage mb-1">
              7. Non-Refundable Charges
            </p>
            <p>
              KYC verification fees, compliance costs, bank charges, and service fees are non-refundable.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sage mb-1">
              8. Failed or Rejected Transactions
            </p>
            <p>
              In case a transaction fails due to technical reasons or regulatory rejection, the refundable amount, if any, shall be processed after deducting applicable charges.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sage mb-1">
              9. Incorrect Information by User
            </p>
            <p>
              No refund shall be granted if incorrect, incomplete, or misleading information is provided by the User, including errors in travel documents or KYC details.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sage mb-1">
              10. Force Majeure
            </p>
            <p>
              The Company shall not be liable for delays or inability to process refunds due to events beyond its reasonable control.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sage mb-1">
              11. Right to Withhold Refund
            </p>
            <p>
              The Company reserves the right to withhold refunds in case of suspected fraud, money laundering, or regulatory non-compliance until clearance from competent authorities is obtained.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sage mb-1">
              12. Regulatory Overrides
            </p>
            <p>
              This policy is subject to overriding provisions of RBI, FEMA, and statutory authorities from time to time.
            </p>
          </div>

          {/* Divider */}
          <hr className="border-border my-8" />

          {/* Company Details */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sage">
              Company & Grievance Details
            </h3>

            <p>
              <strong>Company CIN:</strong> U74999MH2017PTC292745
            </p>

            <p>
              <strong>Registered Address:</strong> Shop No. 4, Grace Residency, Kharodi, Marve Road, Opp. Sagar Hotel, Malad West, Mumbai, Maharashtra, India – 400095
            </p>

            <p>
              <strong>Grievance Redressal Email:</strong>{" "}
              <a
                href="mailto:info@jbforex.in"
                className="text-sage underline"
              >
                info@jbforex.in
              </a>
            </p>
          </div>

        </div>
      </div>
      <Footer />  
    </div>
  );
};

export default RefundPolicy;
