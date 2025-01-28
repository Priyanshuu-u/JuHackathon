import React from "react";
import Navbar from "./Navbar.jsx";
import Logo from '../assets/MediMitra.jpeg'
function MediMitra() {
  return (
    <div>
      <Navbar />
      <div className="mb-4 bg-gray-50 min-h-screen">
     
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-center my-8 space-y-4 md:space-y-0 md:space-x-6">
  <img
    src={Logo}
    alt="MediMitra Logo"
    className="w-30 h-30 md:w-32 md:h-32 rounded-full "
  />
  <div className="text-center md:text-left">
    <h1 className="text-5xl font-bold text-cyan-700 mb-2">Medi-Mitra: WHO Checklist</h1>
    <p className="text-lg text-gray-600 mb-4">
      A comprehensive guide to ensuring safer surgical practices using the WHO Surgical Safety Checklist Interface.
    </p>
    <a
      href="https://www.who.int/publications/i/item/9789241598590"
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-primary btn-wide shadow-lg"
    >
      Download Official WHO Checklist
    </a>
  </div>
</div>

        {/* Cards Section */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 my-10">
          {[ 
            {
              title: "What is the WHO Checklist?",
              content: [
                "The WHO Surgical Safety Checklist is a 19-item tool designed to ensure safer surgical outcomes.",
                "It helps teams verify critical safety steps and improve communication among healthcare providers.",
              ],
              img: "https://cdn.who.int/media/images/default-source/infographics/who-emblem.png?sfvrsn=877bb56a_2",
            },
            {
              title: "Why use the Checklist?",
              content: [
                "Minimizes errors and oversights during surgeries, improving overall patient safety.",
                "Promotes teamwork and adherence to evidence-based practices.",
                "Reduces morbidity and mortality rates globally."
              ],
              img: "https://st2.depositphotos.com/5266903/8456/v/950/depositphotos_84568184-stock-illustration-question-flat-cyan-color-icon.jpg",
            },
            {
              title: "When to use it?",
              content: [
                "It should be implemented before anesthesia, during the operation, and post-surgery.",
                "Ensures safety checks are conducted at every critical stage of the surgery."
              ],
              img: "https://st2.depositphotos.com/5266903/7831/i/450/depositphotos_78310698-stock-photo-clock-flat-soft-blue-color.jpg",
            },
          ].map((card, index) => (
            <div
              key={index}
              className="card shadow-xl bg-white transition-transform hover:scale-105 cursor-pointer"
            >
              <div className="card-body flex flex-col items-center">
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-24 h-24 mb-4 rounded-full border border-gray-300"
                />
                <h2 className="card-title text-cyan-700 mb-4 text-center">{card.title}</h2>
                <div>
                  <p className="text-gray-600">
                    {card.content.map((point, idx) => (
                      <li key={idx} className="mb-2">{point}</li>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="my-12">
          <h2 className="text-4xl font-bold text-cyan-700 mb-6 text-center">FAQs About the Checklist</h2>
          <div className="space-y-4">
            {[
              {
                question: "What happens if I don't use the checklist?",
                answer: [
                  "Critical safety steps may be missed, leading to increased complications.",
                  "The risk of surgical errors increases significantly, affecting patient outcomes.",
                ],
              },
              {
                question: "How does it improve outcomes?",
                answer: [
                  "Ensures proper verification of patient identity, surgical site, and procedure.",
                  "Improves communication between team members, reducing misunderstandings."
                ],
              },
              {
                question: "Can it be adapted?",
                answer: [
                  "Yes, the WHO encourages institutions to customize the checklist for local needs.",
                  "This improves its relevance and compliance across different settings."
                ],
              },
            ].map((faq, index) => (
              <details
                key={index}
                className="collapse collapse-arrow border border-base-300 bg-white rounded-box"
              >
                <summary className="collapse-title text-xl font-medium text-gray-800">
                  {faq.question}
                </summary>
                <div className="collapse-content">
                  <p className="text-gray-600 mt-2">
                    {faq.answer.map((point, idx) => (
                      <li key={idx} className="mb-2">{point}</li>
                    ))}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Steps Section */}
        <div className="my-12">
          <h2 className="text-4xl font-bold text-cyan-700 mb-6 text-center">Steps to Use the Interface</h2>
          <div className="flex flex-col items-center">
            <ul className="list-decimal list-inside bg-gray-100 p-8 rounded-lg shadow-md text-left w-full lg:w-3/4">
              <li className="text-lg mb-4">Navigate through sections using the navigation bar.</li>
              <li className="text-lg mb-4">Download the official WHO checklist using the button provided above.</li>
              <li className="text-lg mb-4">Read through the cards for key information.</li>
              <li className="text-lg mb-4">Explore detailed FAQs for additional insights.</li>
              <li className="text-lg">Follow the checklist at every stage of surgery to ensure patient safety.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MediMitra;
