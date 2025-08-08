// @ts-check
import React from 'react';

import SEO from '../components/SEO';
import Layout from '../components/Layout';
import NepalMap from '../components/NepalMap';

const DistrictsOfNepalPage = () => {
  // Actual visited districts data - 40 out of 77 districts covered
  /** @type {{name: string, notes: string}[]} */
  const visitedDistricts = [
    { name: 'Ilam', notes: 'Ilam, Kanyam, Fikkal' },
    { name: 'Jhapa', notes: 'Born & raised' },
    { name: 'Morang', notes: 'Pathari, Urlabari' },
    { name: 'Panchthar', notes: 'Sadhutar' },
    { name: 'Solukhumbu', notes: 'Lukla, Namche Bazar, Everest Base Camp, Kala Patthar' },
    { name: 'Sunsari', notes: 'Itahari, Dharan' },
    { name: 'Taplejung', notes: 'Taplejung, Pathibhara Temple' },
    { name: 'Udayapur', notes: 'Gaighat' },

    { name: 'Sarlahi', notes: 'Lalbandi' },
    { name: 'Dhanusha', notes: 'Janakpur, Dhalkebar' },
    { name: 'Mahottari', notes: 'Bardibas' },
    { name: 'Siraha', notes: 'Lahan, Mirchaiya' },
    { name: 'Saptari', notes: 'Highway ride from Lahan to Koshi Barrage' },

    { name: 'Bhaktapur', notes: 'Bhaktapur, Nagarkot' },
    { name: 'Chitawan', notes: 'Narayanghat, Sauraha, Mugling' },
    { name: 'Dhading', notes: 'Malekhu, Dharke' },
    { name: 'Dolakha', notes: 'Kalinchowk, Jiri, Charikot' },
    { name: 'Kathmandu', notes: 'Kathmandu' },
    { name: 'Kabhrepalanchok', notes: 'Dhulikhel, Banepa, Dolalghat' },
    { name: 'Lalitpur', notes: 'Lalitpur' },
    { name: 'Makawanpur', notes: 'Chitlang, Markhu, Kulekhani' },
    { name: 'Nuwakot', notes: 'Nuwakot' },
    { name: 'Sindhuli', notes: 'SindhuliGadi, khurkot' },
    { name: 'Sindhupalchok', notes: 'Tatopani,Kodari, Barhabise' },

    { name: 'Baglung', notes: 'Baglung' },
    { name: 'Kaski', notes: 'Pokhara, Mardi Himal' },
    { name: 'Lamjung', notes: 'Besishahar' },
    { name: 'Manang', notes: 'Manang, Tilicho Lake' },
    { name: 'Mustang', notes: 'Lete, Jomsom, Marpha' },
    { name: 'Myagdi', notes: 'Beni, Tatopani' },
    { name: 'Parbat', notes: 'Kushma, Bihadi' },
    { name: 'Tanahu', notes: 'Bandipur' },

    { name: 'Palpa', notes: 'Tansen' },
  ];

  return (
    <Layout>
      <SEO
        title="Districts of Nepal - Travel Map"
        keywords={['nepal districts', 'nepal travel', 'nepal map', 'districts visited', 'nepal geography']}
        description="Interactive map showing all 77 districts of Nepal. Progress: 40/77 districts visited (52% complete)."
        featuredImage=""
      />
      <div
        style={{
          width: '100vw',
          height: '80vh',
          margin: 0,
          padding: 0,
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          overflow: 'hidden',
        }}
        className="nepal-map-page-container"
      >
        <NepalMap visitedDistricts={visitedDistricts} />
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '18px', fontWeight: '500' }}>
        Districts Visited: {visitedDistricts.length} out of 77 ({Math.round((visitedDistricts.length / 77) * 100)}%
        complete)
      </div>
    </Layout>
  );
};

export default DistrictsOfNepalPage;
