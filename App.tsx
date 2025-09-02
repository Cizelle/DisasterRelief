import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import RNFS from 'react-native-fs';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { useTranslation } from 'react-i18next';
import './i18n';
import type { FeatureCollection } from 'geojson';

// IMPORTANT: Replace with your actual GitHub info
const GITHUB_USERNAME = 'Cizelle';
const REPO_NAME_1 = 'India-Map';
const REPO_NAME_2 = 'India-Map2';

const REPO_1_BASE_URL = `https://${GITHUB_USERNAME}.github.io/${REPO_NAME_1}`;
const REPO_2_BASE_URL = `https://${GITHUB_USERNAME}.github.io/${REPO_NAME_2}`;

// Define types for your data
type Shelter = {
  name: string;
  latitude: number;
  longitude: number;
};

type StateData = {
  name: string;
  downloadUrl: string;
  jsonDataUrl: string;
};

const STATES_DATA: StateData[] = [
  { 
    name: 'Andhra Pradesh', 
    downloadUrl: `${REPO_1_BASE_URL}/india/Andhra_Pradesh/andhra_pradesh.mbtiles`, 
    jsonDataUrl: `${REPO_1_BASE_URL}/india/Andhra_Pradesh/andhra_pradesh_data.json` 
  },
  { 
    name: 'Assam', 
    downloadUrl: `${REPO_1_BASE_URL}/india/Assam/assam.mbtiles`, 
    jsonDataUrl: `${REPO_1_BASE_URL}/india/Assam/assam_data.json` 
  },
  { 
    name: 'Madhya Pradesh', 
    downloadUrl: `${REPO_2_BASE_URL}/india2/Madhya_Pradesh/madhya_pradesh.mbtiles`, 
    jsonDataUrl: `${REPO_2_BASE_URL}/india2/Madhya_Pradesh/madhya_pradesh_data.json` 
  },
  { 
    name: 'Rajasthan', 
    downloadUrl: `${REPO_2_BASE_URL}/india2/Rajasthan/rajasthan.mbtiles`, 
    jsonDataUrl: `${REPO_2_BASE_URL}/india2/Rajasthan/rajasthan_data.json` 
  },
];

MapboxGL.setAccessToken('pk.eyJ1Ijoicm9oaXRrb2xsYSIsImEiOiJjbDF2ajF4d3AwMGNvM2RwYXFmbG44Z3huIn0.H7rC0mC_P9NqU97n_wVw8w');

const App = () => {
  const { t, i18n } = useTranslation();
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [mapFilePath, setMapFilePath] = useState<string | null>(null);
  const [shelterData, setShelterData] = useState<Shelter[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const downloadFiles = async (state: StateData) => {
    setLoading(true);
    setDownloadError(null); // Clear any previous errors
    const mbtilesPath = `${RNFS.DocumentDirectoryPath}/${state.name.replace(/\s/g, '_')}.mbtiles`;
    const jsonPath = `${RNFS.DocumentDirectoryPath}/${state.name.replace(/\s/g, '_')}_data.json`;
    
    try {
        await RNFS.downloadFile({ fromUrl: state.downloadUrl, toFile: mbtilesPath }).promise;
        await RNFS.downloadFile({ fromUrl: state.jsonDataUrl, toFile: jsonPath }).promise;
        
        const data = await RNFS.readFile(jsonPath, 'utf8');
        setShelterData(JSON.parse(data));
        setMapFilePath(mbtilesPath);
        setSelectedState(state.name);
        Alert.alert(t('downloadComplete'), t('downloadReady', { state: t(`stateList.${state.name}`) }));
    } catch (error: any) {
        console.error('Download error:', error);
        setDownloadError(t('downloadError') + `\n\n${error.message}`);
        Alert.alert(t('downloadFailed'), t('downloadError'));
        setMapFilePath(null);
        setShelterData(null);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    const checkExistingFiles = async () => {
        for (const state of STATES_DATA) {
            const mbtilesPath = `${RNFS.DocumentDirectoryPath}/${state.name.replace(/\s/g, '_')}.mbtiles`;
            const jsonPath = `${RNFS.DocumentDirectoryPath}/${state.name.replace(/\s/g, '_')}_data.json`;
            
            const mbtilesExists = await RNFS.exists(mbtilesPath);
            const jsonExists = await RNFS.exists(jsonPath);
            
            if (mbtilesExists && jsonExists) {
                const data = await RNFS.readFile(jsonPath, 'utf8');
                setShelterData(JSON.parse(data));
                setMapFilePath(mbtilesPath);
                setSelectedState(state.name);
                break;
            }
        }
    };
    checkExistingFiles();
  }, []);

  const handleMarkerPress = (e: any) => {
    if (e.features && e.features.length > 0) {
      const shelterName = e.features[0].properties.name;
      Alert.alert(t('shelterDetails'), shelterName);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.text}>{t('downloading')}</Text>
      </View>
    );
  }

  // --- NEW ERROR HANDLING BLOCK ---
  if (downloadError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{t('downloadFailed')}</Text>
        <Text style={styles.errorText}>{downloadError}</Text>
        <Button title="Try Again" onPress={() => setDownloadError(null)} />
      </View>
    );
  }
  // --- END NEW ERROR HANDLING BLOCK ---

  if (mapFilePath && shelterData) {
  const geoJsonData: FeatureCollection = {
  type: 'FeatureCollection',
  features: shelterData.map(shelter => ({
    type: 'Feature',
    properties: { name: shelter.name },
    geometry: {
      type: 'Point',
      coordinates: [shelter.longitude, shelter.latitude],
    },
  })),
};

    const localStyle = {
      'version': 8,
      'name': 'Local Map',
      'sources': {
        'my-local-tiles': {
          'type': 'vector',
          'url': `mbtiles://${mapFilePath}`,
        },
      },
      'layers': [
        {
          'id': 'my-local-layer',
          'type': 'fill',
          'source': 'my-local-tiles',
          'source-layer': 'your_source_layer_name',
          'paint': {
            'fill-color': 'rgba(200, 100, 240, 0.4)',
            'fill-outline-color': 'rgba(200, 100, 240, 1)',
          },
        },
      ],
    };

    return (
      <View style={styles.page}>
        <View style={styles.container}>
          <MapboxGL.MapView
            style={styles.map}
            styleURL={localStyle as any}
          >
            <MapboxGL.Camera
                zoomLevel={6}
                centerCoordinate={[82.9739, 21.2787]}
                animationMode={'flyTo'}
                animationDuration={0}
            />
            
            <MapboxGL.ShapeSource id="sheltersSource" shape={geoJsonData} onPress={handleMarkerPress}>
              <MapboxGL.SymbolLayer
                id="sheltersLayer"
                style={{
                  iconImage: 'shelter_icon', 
                  textField: ['get', 'name'],
                  textSize: 12,
                  textColor: 'blue',
                  textHaloColor: 'white',
                  textHaloWidth: 1,
                  textAllowOverlap: true
                }}
              />
            </MapboxGL.ShapeSource>
          </MapboxGL.MapView>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <View style={styles.languageContainer}>
        <Text style={styles.languageTitle}>{t('selectLanguage')}:</Text>
        <Button title={t('languages.en')} onPress={() => changeLanguage('en')} />
        <Button title={t('languages.hi')} onPress={() => changeLanguage('hi')} />
      </View>
      
      <Text style={styles.title}>{t('states')}</Text>
      <ScrollView style={styles.scrollView}>
        {STATES_DATA.map((state) => (
          <View key={state.name} style={styles.buttonWrapper}>
            <Button
              title={t(`downloadMap`, { state: t(`stateList.${state.name}`) })}
              onPress={() => downloadFiles(state)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5FCFF',
  },
  container: {
    flex: 1,
    width: '100%',
  },
  map: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    marginTop: 20,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  languageTitle: {
    fontSize: 16,
    marginRight: 10,
    fontWeight: 'bold',
  },
  buttonWrapper: {
    marginVertical: 10,
  },
  scrollView: {
    width: '100%',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default App;