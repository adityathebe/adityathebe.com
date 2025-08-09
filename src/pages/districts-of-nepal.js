// @ts-check
import React from 'react';

import SEO from '../components/SEO';
import Layout from '../components/Layout';
import NepalMap from '../components/NepalMap';

const DistrictsOfNepalPage = () => {
  /** @type {{name: string, notes: string, }[]} */
  const visitedDistricts = [
    // Province 1 (Koshi Province)
    // { name: 'Bhojpur', notes: '' },
    // { name: 'Dhankuta', notes: '' },
    { name: 'Ilam', notes: 'Ilam, Kanyam, Fikkal' },
    { name: 'Jhapa', notes: 'Born & raised' },
    // { name: 'Khotang', notes: '' },
    { name: 'Morang', notes: 'Pathari, Urlabari' },
    // { name: 'Okhaldhunga', notes: '' },
    { name: 'Panchthar', notes: 'Sadhutar' },
    // { name: 'Sankhuwasabha', notes: '' },
    { name: 'Solukhumbu', notes: 'Lukla, Namche Bazar, Everest Base Camp, Kala Patthar' },
    { name: 'Sunsari', notes: 'Itahari, Dharan' },
    { name: 'Taplejung', notes: 'Taplejung, Pathibhara Temple' },
    // { name: 'Terhathum', notes: '' },
    { name: 'Udayapur', notes: 'Gaighat' },

    // Province 2 (Madhesh Province)
    // { name: 'Bara', notes: '' },
    { name: 'Dhanusha', notes: 'Janakpur, Dhalkebar' },
    { name: 'Mahottari', notes: 'Bardibas' },
    // { name: 'Parsa', notes: '' },
    // { name: 'Rautahat', notes: '' },
    { name: 'Saptari', notes: 'Highway ride from Lahan to Koshi Barrage' },
    { name: 'Sarlahi', notes: 'Lalbandi' },
    { name: 'Siraha', notes: 'Lahan, Mirchaiya' },

    // Bagmati Province
    { name: 'Bhaktapur', notes: 'Bhaktapur, Nagarkot' },
    { name: 'Chitawan', notes: 'Narayanghat, Sauraha, Mugling' },
    { name: 'Dhading', notes: 'Malekhu, Dharke' },
    { name: 'Dolakha', notes: 'Kalinchowk, Jiri, Charikot' },
    { name: 'Kathmandu', notes: 'Kathmandu' },
    { name: 'Kabhrepalanchok', notes: 'Dhulikhel, Banepa, Dolalghat' },
    { name: 'Lalitpur', notes: 'Lalitpur' },
    { name: 'Makawanpur', notes: 'Chitlang, Markhu, Kulekhani' },
    { name: 'Nuwakot', notes: 'Nuwakot' },
    // { name: 'Ramechhap', notes: '' },
    // { name: 'Rasuwa', notes: '' },
    { name: 'Sindhuli', notes: 'SindhuliGadi, khurkot' },
    { name: 'Sindhupalchok', notes: 'Tatopani,Kodari, Barhabise' },

    // Gandaki Province
    { name: 'Baglung', notes: 'Baglung' },
    { name: 'Gorkha', notes: 'Manakamana Temple' },
    { name: 'Kaski', notes: 'Pokhara, Mardi Himal' },
    { name: 'Lamjung', notes: 'Besishahar' },
    { name: 'Manang', notes: 'Manang, Tilicho Lake' },
    { name: 'Mustang', notes: 'Lete, Jomsom, Marpha, Muktinath' },
    { name: 'Myagdi', notes: 'Beni, Tatopani' },
    // { name: 'Nawalparasi East', notes: '' },
    { name: 'Parbat', notes: 'Kushma' },
    // { name: 'Syangja', notes: '' },
    { name: 'Tanahu', notes: 'Damauli, Bandipur' },

    // Lumbini Province
    // { name: 'Arghakhanchi', notes: '' },
    // { name: 'Banke', notes: '' },
    // { name: 'Bardiya', notes: '' },
    // { name: 'Dang', notes: '' },
    // { name: 'Gulmi', notes: '' },
    // { name: 'Kapilbastu', notes: '' },
    // { name: 'Nawalparasi West', notes: '' },
    { name: 'Palpa', notes: 'Tansen' },
    // { name: 'Pyuthan', notes: '' },
    // { name: 'Rolpa', notes: '' },
    // { name: 'Rukum East', notes: '' },
    // { name: 'Rupandehi', notes: '' },

    // Karnali Province
    // { name: 'Dailekh', notes: '' },
    // { name: 'Dolpa', notes: '' },
    // { name: 'Humla', notes: '' },
    // { name: 'Jajarkot', notes: '' },
    // { name: 'Jumla', notes: '' },
    // { name: 'Kalikot', notes: '' },
    // { name: 'Mugu', notes: '' },
    // { name: 'Rukum West', notes: '' },
    // { name: 'Salyan', notes: '' },
    // { name: 'Surkhet', notes: '' },

    // Sudurpashchim Province
    // { name: 'Achham', notes: '' },
    // { name: 'Baitadi', notes: '' },
    // { name: 'Bajhang', notes: '' },
    // { name: 'Bajura', notes: '' },
    // { name: 'Dadeldhura', notes: '' },
    // { name: 'Darchula', notes: '' },
    // { name: 'Doti', notes: '' },
    // { name: 'Kailali', notes: '' },
    // { name: 'Kanchanpur', notes: '' },
  ];

  return (
    <Layout>
      <SEO
        title="Districts of Nepal - Travel Map"
        keywords={['nepal districts', 'nepal travel', 'nepal map', 'districts visited', 'nepal geography']}
        description="Interactive map showing all 77 districts of Nepal. Progress: 40/77 districts visited (52% complete)."
        featuredImage="districts-of-nepal.png"
      />

      <NepalMap visitedDistricts={visitedDistricts} />

      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Visited: {visitedDistricts.length}/77 ({Math.round((visitedDistricts.length / 77) * 100)}%)
      </p>
    </Layout>
  );
};

export default DistrictsOfNepalPage;
