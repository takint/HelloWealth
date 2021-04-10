import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from os import path
from keras.models import Sequential
from keras.layers import Dense, LSTM, Dropout
from sklearn.preprocessing import MinMaxScaler
import yfinance as yf
import pymongo
import datetime
import pickle
from pandas.tseries.offsets import BDay

p_stock = 'MSFT'

train_to_date = '2020-06-30'
train_from_date = '2016-01-01' # Fix date cannot be changed as we would like to define the start date with 5 year00000000000

test_to_date = '2021-04-02'
test_from_date = '2020-07-01'

#Train model
n_epochs = 50
n_batch_size = 32
n_last_day = 60  # used historical 60 days before the predicted day


def get_model(n_input_shape):
    regressor = Sequential()
    regressor.add(LSTM(units=64, return_sequences=True, input_shape=n_input_shape))
    regressor.add(Dropout(0.2))
    regressor.add(LSTM(units=64, return_sequences=True))
    regressor.add(Dropout(0.2))
    regressor.add(LSTM(units=64, return_sequences=True))
    regressor.add(Dropout(0.2))
    regressor.add(LSTM(units=64))
    regressor.add(Dropout(0.2))
    regressor.add(Dense(units=1))
    regressor.compile(optimizer='adam', loss='mean_squared_error')
    return regressor


# Read from yahoo API info dataframe
def get_data(from_date, to_date):
    tmp = yf.download(p_stock, start=from_date, end=to_date, progress=False)
    return tmp

# read data from mongo and save into df
def save_predict_to_mongo(p_ac, from_date, to_date):


    db = 'stock_db'
    collection_name = p_stock.lower()
    cluster_name = "hellowealth.wnyrs"
    mongodb_user = "test"
    mongodb_pass = "1111"

    client = pymongo.MongoClient(
        "mongodb+srv://{}:{}@{}.mongodb.net/{}?retryWrites=true&w=majority".format(mongodb_user,
                                                                                   mongodb_pass, cluster_name, db))
    db = client.stock_db
    collection = db[collection_name]
    collection.drop()


#Query data from date
    from_date = datetime.datetime(int(from_date[:4]), int(from_date[5:7]), int(from_date[-2:]))
    to_date = datetime.datetime(int(to_date[:4]), int(to_date[5:7]), int(to_date[-2:]))

    for row in p_ac:
        print(row)
        my_dict = {"date": from_date, "Close": float(row[0])}
        print(my_dict)
        x = collection.insert_one(my_dict)

        from_date += BDay(1)

    return
#read data from mông in certain time frame
def get_data_from_mongo(from_date, to_date):
    db = 'stock_db'
    collection_name = p_stock.lower()
    cluster_name = "hellowealth.wnyrs"
    mongodb_user = "test"
    mongodb_pass = "1111"
    client = pymongo.MongoClient(
        "mongodb+srv://{}:{}@{}.mongodb.net/{}?retryWrites=true&w=majority".format(mongodb_user,
                                                                           mongodb_pass, cluster_name, db))
    db = client.stock_db
    collection = db[collection_name]

#Query to date
    from_date = datetime.datetime(int(from_date[:4]), int(from_date[5:7]), int(from_date[-2:]))
    to_date = datetime.datetime(int(to_date[:4]), int(to_date[5:7]), int(to_date[-2:]))
    query_string = {"date": {"$lt": to_date}, "date": {"$gt": from_date}}
    cursor = collection.find(query_string)
    df = pd.DataFrame(list(cursor))

    return df


# Get Stock from 2016 1 January to 30 June 2020
stock_df = get_data_from_mongo(train_from_date, train_to_date)
print(stock_df.head())

# Get Close Price for train data
training_set = stock_df['Close'].values
training_set = training_set.reshape(-1, 1)

#Feature Scaling
sc = MinMaxScaler(feature_range=(0, 1))
training_set_scaled = sc.fit_transform(training_set)

with open('scalemodel_{}.pkl'.format(p_stock.lower()),'wb') as f:
    pickle.dump(sc, f)

# Split into train data
X_train = []
y_train = []
no_of_sample = len(training_set_scaled)

for i in range(n_last_day, no_of_sample):
    X_train.append(training_set_scaled[i - n_last_day:i, 0])
    y_train.append(training_set_scaled[i, 0])

# Conver X_train, y_train from list into numpy array
X_train, y_train = np.array(X_train), np.array(y_train)

# Reshape X_train
X_train = np.reshape(X_train, (X_train.shape[0], X_train.shape[1], 1))

model = get_model(n_input_shape=(X_train.shape[1], 1))
filename = "stock_model_{}.h5".format(p_stock.lower())
model.fit(X_train, y_train, epochs=n_epochs, batch_size=n_batch_size)
model.save(filename)

stock_df_test = get_data_from_mongo(test_from_date, test_to_date)

stock_total = pd.concat((stock_df['Close'], stock_df_test['Close']), axis=0)
test_set = stock_total[len(stock_total) - len(stock_df_test) - n_last_day:].values

test_set = test_set.reshape(-1, 1)
test_set = sc.transform(test_set)

X_test = []
no_of_sample = len(test_set)

for i in range(n_last_day, no_of_sample):
    X_test.append(test_set[i - n_last_day:i, 0])

X_test = np.array(X_test)
X_test = np.reshape(X_test, (X_test.shape[0], X_test.shape[1], 1))

predicted_stock_price = model.predict(X_test)
predicted_stock_price = sc.inverse_transform(predicted_stock_price)
save_predict_to_mongo(predicted_stock_price, from_date=test_from_date,to_date=test_to_date)
real_stock_price = stock_df_test['Close'].values.reshape(-1, 1)

#Plot model compare predict price and real
plt.figure(figsize=(10, 5))
plt.plot(real_stock_price, color='red', label='Real {} Stock Price'.format(p_stock))
plt.plot(predicted_stock_price, color='blue', label='Predicted {} Stock Price'.format(p_stock))
plt.title('{} Stock Price Prediction'.format(p_stock))
plt.xlabel('Date')
plt.ylabel('{} Stock Price'.format(p_stock))
plt.legend()
plt.show()
