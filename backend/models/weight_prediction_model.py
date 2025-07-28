# 체중 예측 모델
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from datetime import datetime, timedelta
import joblib

class WeightPredictionModel:
    def __init__(self):
        self.model = LinearRegression()
        self.scaler = StandardScaler()
        self.is_trained = False
    
    def prepare_features(self, weight_data):
        """체중 데이터를 모델 학습용 특성으로 변환"""
        df = pd.DataFrame(weight_data)
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date')
        
        # 날짜를 숫자로 변환 (기준일로부터 경과 일수)
        base_date = df['date'].min()
        df['days_since_start'] = (df['date'] - base_date).dt.days
        
        # 이동평균 추가
        df['weight_ma_3'] = df['weight'].rolling(window=3, min_periods=1).mean()
        df['weight_ma_7'] = df['weight'].rolling(window=7, min_periods=1).mean()
        
        return df
    
    def train(self, weight_data):
        """체중 데이터로 모델 학습"""
        if len(weight_data) < 5:
            raise ValueError("최소 5개의 체중 데이터가 필요합니다")
        
        df = self.prepare_features(weight_data)
        
        # 특성 선택
        features = ['days_since_start', 'weight_ma_3', 'weight_ma_7']
        X = df[features].values
        y = df['weight'].values
        
        # 정규화
        X_scaled = self.scaler.fit_transform(X)
        
        # 모델 학습
        self.model.fit(X_scaled, y)
        self.is_trained = True
        
        return self
    
    def predict_future_weight(self, weight_data, days_ahead=14):
        """향후 체중 예측"""
        if not self.is_trained:
            raise ValueError("모델이 학습되지 않았습니다")
        
        df = self.prepare_features(weight_data)
        last_row = df.iloc[-1]
        
        predictions = []
        current_weight = last_row['weight']
        current_ma_3 = last_row['weight_ma_3']
        current_ma_7 = last_row['weight_ma_7']
        
        for day in range(1, days_ahead + 1):
            # 특성 생성
            days_since_start = last_row['days_since_start'] + day
            features = np.array([[days_since_start, current_ma_3, current_ma_7]])
            
            # 예측
            features_scaled = self.scaler.transform(features)
            predicted_weight = self.model.predict(features_scaled)[0]
            
            # 예측 날짜
            prediction_date = last_row['date'] + timedelta(days=day)
            
            predictions.append({
                'date': prediction_date.strftime('%Y-%m-%d'),
                'predicted_weight': round(predicted_weight, 1)
            })
            
            # 이동평균 업데이트 (간단한 근사)
            current_weight = predicted_weight
            current_ma_3 = (current_ma_3 * 2 + predicted_weight) / 3
            current_ma_7 = (current_ma_7 * 6 + predicted_weight) / 7
        
        return predictions