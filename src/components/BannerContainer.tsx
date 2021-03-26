import React, { useEffect } from 'react';
import { View } from 'react-native';
import admob, { MaxAdContentRating, BannerAd, BannerAdSize } from '@react-native-firebase/admob';
import { Platform } from 'react-native';

const BannerContainer = () => {
    const unitId = Platform.OS === 'ios' ?
        'ca-app-pub-4657820549429217/1841450073' : 'ca-app-pub-4657820549429217/3011061516'; // 앱id가 아닌 광고단위 id

    useEffect(() => {
        admob()
            .setRequestConfiguration({
                maxAdContentRating: MaxAdContentRating.PG,
                tagForChildDirectedTreatment: true,
                tagForUnderAgeOfConsent: true,
            })
            .then(() => {
                // Request config successfully set!
            });

    }, []);
    return <BannerAd
        unitId={unitId}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{
            requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={(): void => {
            console.log('ad loaded');
        }}
        onAdFailedToLoad={(error: any): void => {
            console.log('ad fail');
            console.log(error.code);
            console.log(error.meesage);
        }}
        onAdOpened={() => {
            console.log('ad open');
        }}
        onAdClosed={() => {
            console.log('ad close');
        }}
        onAdLeftApplication={(): void => {
            console.log('ad close');
        }} />;
};

export default BannerContainer;