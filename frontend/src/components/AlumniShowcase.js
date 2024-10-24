import React, { useState, useEffect } from 'react';
import './AlumniShowcase.css'; // Import your custom CSS for additional styles

const alumniData = [
  {
    name: "Alumni One",
    status: "Software Engineer at ABC Corp",
    images: [
      "path/to/alumni1_img1.jpg",
      "path/to/alumni1_img2.jpg",
      "path/to/alumni1_img3.jpg",
      "path/to/alumni1_img4.jpg",
      "path/to/alumni1_img5.jpg",
    ],
  },
  {
    name: "Alumni Two",
    status: "Data Scientist at XYZ Ltd",
    images: [
      "path/to/alumni2_img1.jpg",
      "path/to/alumni2_img2.jpg",
      "path/to/alumni2_img3.jpg",
      "path/to/alumni2_img4.jpg",
      "path/to/alumni2_img5.jpg",
    ],
  },
  {
    name: "Alumni Three",
    status: "Product Manager at 123 Inc",
    images: [
      "path/to/alumni3_img1.jpg",
      "path/to/alumni3_img2.jpg",
      "path/to/alumni3_img3.jpg",
      "path/to/alumni3_img4.jpg",
      "path/to/alumni3_img5.jpg",
    ],
  },
  {
    name: "Alumni Four",
    status: "UX Designer at Design Co",
    images: [
      "path/to/alumni4_img1.jpg",
      "path/to/alumni4_img2.jpg",
      "path/to/alumni4_img3.jpg",
      "path/to/alumni4_img4.jpg",
      "path/to/alumni4_img5.jpg",
    ],
  },
];

const AlumniShowcase = () => {
  const [currentAlumniIndex, setCurrentAlumniIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const alumniInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % alumniData[currentAlumniIndex].images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(alumniInterval); // Clear interval on unmount
  }, [currentAlumniIndex]);

  useEffect(() => {
    const alumniChangeInterval = setInterval(() => {
      setCurrentAlumniIndex((prevIndex) => (prevIndex + 1) % alumniData.length);
    }, 15000); // Change alumni every 15 seconds

    return () => clearInterval(alumniChangeInterval); // Clear interval on unmount
  }, []);

  return (
    <div className="alumni-showcase py-12 bg-gray-100 text-center">
      <h2 className="creative-heading text-3xl font-bold mb-8"> {/* Apply new class */}
        Alumni Showcase
      </h2>
      <div className="alumni-cards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {alumniData.map((alumni, index) => (
          <div className="alumni-card p-4 bg-white rounded-lg shadow-md" key={index}>
            <img
              src={alumni.images[currentImageIndex]} 
              alt={alumni.name} 
              className="alumni-image w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold">{alumni.name}</h3>
            <p className="text-gray-700">{alumni.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlumniShowcase;
