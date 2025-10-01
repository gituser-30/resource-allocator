import React from "react";

const ThingsWeShare = () => {
  const items = [
    {
      title: "📚 Study Notes",
      desc: "Well-organized notes for all branches and years to help you revise quickly."
    },
    {
      title: "📖 Previous Year Question Papers",
      desc: "Collection of PYQs to help you prepare for exams effectively."
    },
    {
      title: "📝 Assignments & Solutions",
      desc: "Download assignments with solutions for better understanding."
    },
    {
      title: "💡 Project Ideas",
      desc: "Explore project ideas and resources to enhance your technical skills."
    },
    {
      title: "🎯 Career Guidance",
      desc: "Tips, interview prep, and learning resources to shape your career."
    }
  ];

  return (
    <div className="container-fluid " style={{backgroundColor: "#0c2853ff"}}>
      <h2 className="text-center fw-bold mb-3 py-3 text-warning">✨ Things We Will Share With You</h2>
      <p className="text-center text-light mb-5">
        Our mission is to make learning simple and accessible for every DBATU scholar.  
        Here’s what you’ll find on this platform:
      </p>

      <div className="row g-4">
        {items.map((item, index) => (
          <div key={index} className="col-md-4 col-sm-6 my-5">
            <div className="card h-100 shadow-sm border-0 text-center p-3">
              <div className="card-body">
                <h5 className="card-title fw-bold">{item.title}</h5>
                <p className="card-text text-muted">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThingsWeShare;
