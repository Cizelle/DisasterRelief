import 'react-native-gesture-handler';
import React from 'react';
import { View, Text, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import './i18n';

// Define a type for your data
type StateData = {
  name: string;
};

const STATES_DATA: StateData[] = [
  { name: 'Andhra Pradesh' },
  { name: 'Assam' },
  { name: 'Madhya Pradesh' },
  { name: 'Rajasthan' },
  { name: 'Arunachal Pradesh' },
  { name: 'Bihar' },
  { name: 'Chhattisgarh' },
  { name: 'Goa' },
  { name: 'Gujarat' },
  { name: 'Haryana' },
  { name: 'Himachal Pradesh' },
  { name: 'Jharkhand' },
  { name: 'Karnataka' },
  { name: 'Kerala' },
  { name: 'Maharashtra' },
  { name: 'Manipur' },
  { name: 'Meghalaya' },
  { name: 'Mizoram' },
  { name: 'Nagaland' },
  { name: 'Odisha' },
  { name: 'Punjab' },
  { name: 'Sikkim' },
  { name: 'Tamil Nadu' },
  { name: 'Telangana' },
  { name: 'Tripura' },
  { name: 'Uttar Pradesh' },
  { name: 'Uttarakhand' },
  { name: 'West Bengal' },
  // Union Territories
  { name: 'Andaman and Nicobar Islands' },
  { name: 'Chandigarh' },
  { name: 'Dadra and Nagar Haveli and Daman and Diu' },
  { name: 'Delhi' },
  { name: 'Jammu and Kashmir' },
  { name: 'Ladakh' },
  { name: 'Lakshadweep' },
  { name: 'Puducherry' }
];

const App = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const handleStateSelection = (stateName: string) => {
    // This function now just confirms the selection for now
    Alert.alert(t('states'), `You selected ${t(`stateList.${stateName}`)}.`);
  };

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
              title={t(`stateList.${state.name}`)}
              onPress={() => handleStateSelection(state.name)}
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
    justifyContent: 'space-around',
    width: '100%',
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
});

export default App;