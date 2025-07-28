export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { weight_data, days_ahead } = req.body

    // 간단한 예측 로직 (실제로는 ML 모델 사용)
    const predictions = []
    const lastWeight = weight_data[weight_data.length - 1]?.weight || 70

    for (let i = 1; i <= days_ahead; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      
      // 간단한 선형 예측 (실제로는 더 복잡한 알고리즘)
      const predictedWeight = lastWeight + (Math.random() - 0.5) * 0.5
      
      predictions.push({
        date: date.toISOString().split('T')[0],
        predicted_weight: Math.round(predictedWeight * 10) / 10
      })
    }

    res.status(200).json({
      predictions,
      input_data_count: weight_data.length,
      prediction_days: days_ahead
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
} 