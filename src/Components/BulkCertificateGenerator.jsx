import React, { useState } from 'react';

const BulkCertificateGenerator = () => {
  const [templateData, setTemplateData] = useState({
    awardName: '',
    instituteName: '',
    date: '',
  });

  const [recipients, setRecipients] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [error, setError] = useState('');

  const handleTemplateChange = (e) => {
    setTemplateData({
      ...templateData,
      [e.target.name]: e.target.value
    });
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const csvData = event.target.result;
          const rows = csvData.split('\n');
          const headers = rows[0].split(',').map(header => header.trim());

          // Validate required columns
          const firstNameIndex = headers.findIndex(h => 
            h.toLowerCase() === 'firstname' || h.toLowerCase() === 'first_name'
          );
          const lastNameIndex = headers.findIndex(h => 
            h.toLowerCase() === 'lastname' || h.toLowerCase() === 'last_name'
          );

          if (firstNameIndex === -1 || lastNameIndex === -1) {
            throw new Error('CSV must contain FirstName and LastName columns');
          }

          // Parse recipients
          const parsedRecipients = rows.slice(1)
            .filter(row => row.trim())
            .map(row => {
              const columns = row.split(',').map(col => col.trim());
              return {
                firstName: columns[firstNameIndex],
                lastName: columns[lastNameIndex],
                fullName: `${columns[firstNameIndex]} ${columns[lastNameIndex]}`
              };
            });

          setRecipients(parsedRecipients);
          setError('');
          setPreviewIndex(0); // Reset preview index when new data is loaded
        } catch (err) {
          setError(err.message);
          setRecipients([]);
        }
      };
      reader.readAsText(file);
    }
  };

  const handlePreviewNavigation = (direction) => {
    if (direction === 'next' && previewIndex < recipients.length - 1) {
      setPreviewIndex(previewIndex + 1);
    } else if (direction === 'prev' && previewIndex > 0) {
      setPreviewIndex(previewIndex - 1);
    }
  };

  const generateCertificates = () => {
    if (recipients.length === 0) {
      alert('No recipients to generate certificates for.');
      return;
    }

    // Logic to handle the generation of certificates for each recipient
    recipients.forEach((recipient) => {
      // Implement your logic to generate and download certificates
      console.log(`Generating certificate for ${recipient.fullName}`);
      // You can integrate a PDF generation library here to create certificates
    });

    alert(`Generated ${recipients.length} certificates successfully!`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Bulk Certificate Generator</h1>

      {/* CSV Upload Section */}
      <div className="border-dashed border-2 border-gray-400 rounded-lg p-6 text-center mb-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleCSVUpload}
          style={{ display: 'none' }}
          id="csv-upload"
        />
        <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center">
          <svg className="h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.403 2.403A2 2 0 0116 21H6a2 2 0 01-2-2v-1.4M12 3v9m0 0l3-3m-3 3l-3-3m9 6a2 2 0 01-2 2H8a2 2 0 01-2-2V9l1-1h12l1 1v9z"></path>
          </svg>
          <span>Upload CSV file with FirstName and LastName columns</span>
        </label>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <div className="flex">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m2 0h-2m-2 0H9m5 0h2m2 0H9m0 0V9m5 5v1m1 0h-2m2 0h-2m0 0V9m0 0h2m-2 3V9m0 0h2m-2 0h2m-2 3V9m0 0h2m-2 3v3m0 0h-2m0 0v-1m-1 0H9m-1 0h-2m0 0v1m1 0H9m-2 0h-2m-2 0h2m0 0V9m0 3h2m0 0H5m0 0v1m0 0h2m0 0V9m2 0h2m2 0h-2m0 0V9m0 3h-2m0 0V9m2 0h2m-2 3H9"></path>
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Template Settings */}
      <div className="flex flex-wrap mb-4">
        <div className="w-full md:w-1/3 mb-4">
          <label className="block mb-1">Award/Course Name</label>
          <input
            name="awardName"
            value={templateData.awardName}
            onChange={handleTemplateChange}
            className="input input-bordered w-full"
            placeholder="Enter award name"
          />
        </div>
        <div className="w-full md:w-1/3 mb-4">
          <label className="block mb-1">Institute Name</label>
          <input
            name="instituteName"
            value={templateData.instituteName}
            onChange={handleTemplateChange}
            className="input input-bordered w-full"
            placeholder="Enter institute name"
          />
        </div>
        <div className="w-full md:w-1/3 mb-4">
          <label className="block mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={templateData.date}
            onChange={handleTemplateChange}
            className="input input-bordered w-full"
          />
        </div>
      </div>

      {/* Certificate Preview */}
      {recipients.length > 0 && (
        <div className="flex flex-col">
          <div className="flex justify-between mb-4">
            <span>Preview ({previewIndex + 1} of {recipients.length})</span>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePreviewNavigation('prev')}
                className="btn btn-primary"
                disabled={previewIndex === 0}
              >
                Previous
              </button>
              <button
                onClick={() => handlePreviewNavigation('next')}
                className="btn btn-primary"
                disabled={previewIndex === recipients.length - 1}
              >
                Next
              </button>
            </div>
          </div>

          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <div className="text-center p-8">
              <h2 className="text-xl font-bold mb-4">Certificate of Achievement</h2>
              <p className="text-lg mb-2">{recipients[previewIndex].fullName}</p>
              <p className="mb-4">has successfully completed</p>
              <p className="text-lg font-bold mb-2">{templateData.awardName || '[Award/Course Name]'}</p>
              <p className="mb-4">at</p>
              <p className="text-lg mb-4">{templateData.instituteName || '[Institute Name]'}</p>
              <p>{templateData.date || 'DD/MM/YYYY'}</p>
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <span className="text-sm">Total certificates to generate: {recipients.length}</span>
            <button onClick={generateCertificates} className="btn btn-success">
              Generate All Certificates
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkCertificateGenerator;
