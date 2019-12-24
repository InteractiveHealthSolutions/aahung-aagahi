export const location = {
  provinces: [
    { id: 1, name: 'Sindh', value: 'Sindh', label: 'Sindh' },
    { id: 2, name: 'Punjab', value: 'Punjab', label: 'Punjab' },
    { id: 3, name: 'Balochistan', value: 'Balochistan', label: 'Balochistan' },
    { id: 4, name: 'KP', value: 'KP', label: 'Khyber Pakhtunkhwa' },
    { id: 5, name: 'Gilgit-Baltistan', value: 'Gilgit-Baltistan', label: 'Gilgit Baltistan' }

  ],
  districts: [
    { id: 1, label: 'Badin', value: 'BDN', provinceId: 1 },
    { id: 2, label: 'Dadu', value: 'DAD', provinceId: 1 },
    { id: 3, label: 'Ghotki', value: 'GTK', provinceId: 1 },
    { id: 4, label: 'Hyderabad', value: 'HDD', provinceId: 1 },
    { id: 5, label: 'Jacobabad', value: 'JAG', provinceId: 1 },
    { id: 6, label: 'Jamshoro', value: 'JMS', provinceId: 1 },
    { id: 7, label: 'Karachi', value: 'KHI', provinceId: 1 },
    { id: 8, label: 'Kashmore', value: 'KSM', provinceId: 1 },
    { id: 9, label: 'Khairpur', value: 'KHP', provinceId: 1 },
    { id: 10, label: 'Korangi', value: 'KOR', provinceId: 1 },
    { id: 11, label: 'Larkana', value: 'LKN', provinceId: 1 },
    { id: 12, label: 'Malir', value: 'MLR', provinceId: 1 },
    { id: 13, label: 'Matiari', value: 'MTR', provinceId: 1 },
    { id: 14, label: 'Mirpur Khas', value: 'MPK', provinceId: 1 },
    { id: 15, label: 'Naushahro Feroze', value: 'NHF', provinceId: 1 },
    { id: 16, label: 'Qambar Shahdadkot', value: 'QMB', provinceId: 1 },
    { id: 17, label: 'Sanghar', value: 'SGR', provinceId: 1 },
    { id: 18, label: 'SBA', value: 'SBA', provinceId: 1 },
    { id: 19, label: 'Shikarpur', value: 'SKP', provinceId: 1 },
    { id: 20, label: 'Sujawal', value: 'SJW', provinceId: 1 },
    { id: 21, label: 'Sukkur', value: 'SKR', provinceId: 1 },
    { id: 22, label: 'Tando Allahyar', value: 'TNA', provinceId: 1 },
    { id: 23, label: 'Tando Muhammad Khan', value: 'TMK', provinceId: 1 },
    { id: 24, label: 'Tharparkar', value: 'TPK', provinceId: 1 },
    { id: 25, label: 'Thatta', value: 'THA', provinceId: 1 },
    { id: 26, label: 'Umerkot', value: 'UMK', provinceId: 1 },
    { id: 27, label: 'Islamabad', value: 'ISB', provinceId: 2 },
    { id: 28, label: 'Attock', value: 'ATK', provinceId: 2 },
    { id: 29, label: 'Bahawalnagar', value: 'BWN', provinceId: 2 },
    { id: 30, label: 'Bahawalpur', value: 'BWP', provinceId: 2 },
    { id: 31, label: 'Bhakkar', value: 'BKR', provinceId: 2 },
    { id: 32, label: 'Chakwal', value: 'CKW', provinceId: 2 },
    { id: 33, label: 'Chiniot', value: 'CNT', provinceId: 2 },
    { id: 34, label: 'Dera Ghazi Khan', value: 'DGK', provinceId: 2 },
    { id: 35, label: 'Faisalabad', value: 'FSB', provinceId: 2 },
    { id: 36, label: 'Gujranwala', value: 'GJW', provinceId: 2 },
    { id: 37, label: 'Gujrat', value: 'GJT', provinceId: 2 },
    { id: 38, label: 'Hafizabad', value: 'HFB', provinceId: 2 },
    { id: 39, label: 'Jhang', value: 'JNG', provinceId: 2 },
    { id: 40, label: 'Jhelum', value: 'JLM', provinceId: 2 },
    { id: 41, label: 'Kasur', value: 'KSR', provinceId: 2 },
    { id: 42, label: 'Khanewal', value: 'KNW', provinceId: 2 },
    { id: 43, label: 'Khushab', value: 'KSB', provinceId: 2 },
    { id: 44, label: 'Lahore', value: 'LHE', provinceId: 2 },
    { id: 45, label: 'Layyah', value: 'LYH', provinceId: 2 },
    { id: 46, label: 'Lodhran', value: 'LDN', provinceId: 2 },
    { id: 47, label: 'Mandi Bahauddin', value: 'MDB', provinceId: 2 },
    { id: 48, label: 'Mianwali', value: 'MNW', provinceId: 2 },
    { id: 49, label: 'Multan', value: 'MUL', provinceId: 2 },
    { id: 50, label: 'Muzaffargarh', value: 'MZG', provinceId: 2 },
    { id: 51, label: 'Narowal', value: 'NRW', provinceId: 2 },
    { id: 52, label: 'Nankana Sahib', value: 'NNS', provinceId: 2 },
    { id: 53, label: 'Okara', value: 'OKR', provinceId: 2 },
    { id: 54, label: 'Pakpattan', value: 'PKP', provinceId: 2 },
    { id: 55, label: 'Rahim Yar Khan', value: 'RYK', provinceId: 2 },
    { id: 56, label: 'Rajanpur', value: 'RJP', provinceId: 2 },
    { id: 57, label: 'Rawalpindi', value: 'RWP', provinceId: 2 },
    { id: 58, label: 'Sahiwal', value: 'SHW', provinceId: 2 },
    { id: 59, label: 'Sargodha', value: 'SGH', provinceId: 2 },
    { id: 60, label: 'Sheikhupura', value: 'SUP', provinceId: 2 },
    { id: 61, label: 'Sialkot', value: 'SLT', provinceId: 2 },
    { id: 62, label: 'Toba Tek Singh', value: 'TTS', provinceId: 2 },
    { id: 63, label: 'Vehari', value: 'VHR', provinceId: 2 },
    { id: 64, label: 'Awaran', value: 'AWR', provinceId: 3 },
    { id: 65, label: 'Barkhan', value: 'BRK', provinceId: 3 },
    { id: 66, label: 'Chagai', value: 'CGI', provinceId: 3 },
    { id: 67, label: 'Dera Bugti', value: 'DRB', provinceId: 3 },
    { id: 68, label: 'Gwadar', value: 'GWD', provinceId: 3 },
    { id: 69, label: 'Harnai', value: 'HRN', provinceId: 3 },
    { id: 70, label: 'Jafarabad', value: 'JFB', provinceId: 3 },
    { id: 71, label: 'Jhal Magsi', value: 'JMG', provinceId: 3 },
    { id: 72, label: 'Kachhi', value: 'KCH', provinceId: 3 },
    { id: 73, label: 'Kalat', value: 'KLT', provinceId: 3 },
    { id: 74, label: 'Kech', value: 'KEH', provinceId: 3 },
    { id: 75, label: 'Kharan', value: 'KRN', provinceId: 3 },
    { id: 76, label: 'Khuzdar', value: 'KZD', provinceId: 3 },
    { id: 77, label: 'Killa Abdullah', value: 'KAB', provinceId: 3 },
    { id: 78, label: 'Killa Saifullah', value: 'KSA', provinceId: 3 },
    { id: 79, label: 'Kohlu', value: 'KHL', provinceId: 3 },
    { id: 80, label: 'Lasbela', value: 'LBL', provinceId: 3 },
    { id: 81, label: 'Lehri', value: 'LRI', provinceId: 3 },
    { id: 82, label: 'Loralai', value: 'LRL', provinceId: 3 },
    { id: 83, label: 'Mastung', value: 'MST', provinceId: 3 },
    { id: 84, label: 'Musakhel', value: 'MKL', provinceId: 3 },
    { id: 85, label: 'Nasirabad', value: 'NSB', provinceId: 3 },
    { id: 86, label: 'Nushki', value: 'NSK', provinceId: 3 },
    { id: 87, label: 'Panjgur', value: 'PJG', provinceId: 3 },
    { id: 88, label: 'Pishin', value: 'PSN', provinceId: 3 },
    { id: 89, label: 'Quetta', value: 'QET', provinceId: 3 },
    { id: 90, label: 'Sherani', value: 'SRN', provinceId: 3 },
    { id: 91, label: 'Sibi', value: 'SBI', provinceId: 3 },
    { id: 92, label: 'Sohbatpur', value: 'SBP', provinceId: 3 },
    { id: 93, label: 'Washuk', value: 'WSK', provinceId: 3 },
    { id: 94, label: 'Zhob', value: 'ZHB', provinceId: 3 },
    { id: 95, label: 'Ziarat', value: 'ZRT', provinceId: 3 },
    { id: 96, label: 'Abbottabad', value: 'ABB', provinceId: 4 },
    { id: 97, label: 'Bajaur', value: 'BJR', provinceId: 4 },
    { id: 98, label: 'Bannu', value: 'BNU', provinceId: 4 },
    { id: 99, label: 'Battagram', value: 'BTG', provinceId: 4 },
    { id: 100, label: 'Buner', value: 'BNR', provinceId: 4 },
    { id: 101, label: 'Charsadda', value: 'CRD', provinceId: 4 },
    { id: 102, label: 'Chitral', value: 'CRL', provinceId: 4 },
    { id: 103, label: 'Dera Ismail Khan', value: 'DIK', provinceId: 4 },
    { id: 104, label: 'Hangu', value: 'HNG', provinceId: 4 },
    { id: 105, label: 'Haripur', value: 'HRP', provinceId: 4 },
    { id: 106, label: 'Karak', value: 'KRK', provinceId: 4 },
    { id: 107, label: 'Khyber', value: 'KBR', provinceId: 4 },
    { id: 108, label: 'Kohat', value: 'KOT', provinceId: 4 },
    { id: 109, label: 'Kurram', value: 'KRM', provinceId: 4 },
    { id: 110, label: 'Kolai Pallas', value: 'KLP', provinceId: 4 },
    { id: 111, label: 'Lakki Marwat', value: 'LKM', provinceId: 4 },
    { id: 112, label: 'Lower Dir', value: 'LDR', provinceId: 4 },
    { id: 113, label: 'Lower Kohistan', value: 'LKT', provinceId: 4 },
    { id: 114, label: 'Malakand', value: 'MLK', provinceId: 4 },
    { id: 115, label: 'Mansehra', value: 'MSR', provinceId: 4 },
    { id: 116, label: 'Mardan', value: 'MRD', provinceId: 4 },
    { id: 117, label: 'Mohmand', value: 'MMN', provinceId: 4 },
    { id: 118, label: 'North Waziristan', value: 'NWZ', provinceId: 4 },
    { id: 119, label: 'Nowshera', value: 'NSR', provinceId: 4 },
    { id: 120, label: 'Orakzai', value: 'OKZ', provinceId: 4 },
    { id: 121, label: 'Peshawar', value: 'PEW', provinceId: 4 },
    { id: 122, label: 'Shangla', value: 'SNL', provinceId: 4 },
    { id: 123, label: 'South Waziristan', value: 'SWZ', provinceId: 4 },
    { id: 124, label: 'Swabi', value: 'SWB', provinceId: 4 },
    { id: 125, label: 'Swat', value: 'SWT', provinceId: 4 },
    { id: 126, label: 'Tank', value: 'TNK', provinceId: 4 },
    { id: 127, label: 'Torghar', value: 'TGR', provinceId: 4 },
    { id: 128, label: 'Upper Dir', value: 'UPD', provinceId: 4 },
    { id: 129, label: 'Upper Kohistan', value: 'UPK', provinceId: 4 },
    { id: 128, label: 'Ghanche', value: 'GNC', provinceId: 5 },
    { id: 129, label: 'Skardu', value: 'SDU', provinceId: 5 },
    { id: 130, label: 'Astore', value: 'AST', provinceId: 5 },
    { id: 131, label: 'Diamer', value: 'DAM', provinceId: 5 },
    { id: 132, label: 'Ghizer', value: 'GZR', provinceId: 5 },
    { id: 133, label: 'Gilgit', value: 'GIL', provinceId: 5 },
    { id: 134, label: 'Hunza', value: 'HUN', provinceId: 5 },
    { id: 135, label: 'Kharmang', value: 'KMG', provinceId: 5 },
    { id: 136, label: 'Shigar', value: 'SHI', provinceId: 5 },
    { id: 137, label: 'Nagar', value: 'NAG', provinceId: 5 },
  ]
};

/**
 * return province by selected value
 */
export const getProvinceByValue = function (provinceValue) {
  return location.provinces.filter(province => province.value === provinceValue)[0];
};

/**
 * return province by selected value
 */
export const getDistrictByValue = function (districtValue) {
  return location.districts.filter(district => district.label === districtValue)[0];
};


/**
 * return district by selected province
 */
export const getDistrictsByProvince = function (provinceId) {
  return location.districts.filter(district => district.provinceId === provinceId);
};

/**
 * return district by multiple selected provinces
 */
export const getDistrictsByMultipleProvinces = function (provincesArray) {
  var districtsArray = [];
  provincesArray.forEach(function (province) {
    if (districtsArray.length == 0) {
      districtsArray = location.districts.filter(district => district.provinceId === province.id);
    }
    else {
      var districts = [];
      districts = location.districts.filter(district => district.provinceId === province.id);
      districtsArray = districtsArray.concat(districts);
    }
  })

  var concetenatedProvinces = "";
  districtsArray.forEach(function (city) {
    concetenatedProvinces = concetenatedProvinces.concat(city.label + ",");
  })
  console.log(concetenatedProvinces);
  return districtsArray;
}