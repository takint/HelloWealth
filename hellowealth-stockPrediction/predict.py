import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import pickle
from os import path
from keras.models import Sequential, load_model
from keras.layers import Dense, LSTM, Dropout
from sklearn.preprocessing import MinMaxScaler
import yfinance as yf
import pymongo
import datetime
from pandas.tseries.offsets import BDay

stock = "HPG"
cluster_name = "hellowealth.wnyrs"
mongodb_user = "test"
mongodb_pass = "1111"
db = 'stock_db'
collection_name = 'p_' + stock.lower()
client = pymongo.MongoClient(
    "mongodb+srv://{}:{}@{}.mongodb.net/{}?retryWrites=true&w=majority".format(mongodb_user,
                                                                               mongodb_pass, cluster_name, db))
db = client.stock_db
collection = db[collection_name]
collection.drop()

def get_back_data_from_mongo(from_date, prev_days):
    cluster_name = "hellowealth.wnyrs"
    mongodb_user = "test"
    mongodb_pass = "1111"
    db = 'stock_db'
    collection_name = stock.lower()

    client = pymongo.MongoClient(
        "mongodb+srv://{}:{}@{}.mongodb.net/{}?retryWrites=true&w=majority".format(mongodb_user,
                                                                                   mongodb_pass, cluster_name, db))
    db = client.stock_db
    collection = db[collection_name]

    from_date = datetime.datetime(int(from_date[:4]), int(from_date[5:7]), int(from_date[-2:]))
    back_date = from_date + BDay(-prev_days*2)
    back_date = datetime.datetime(back_date.year, back_date.month, back_date.day)
    print(back_date)

    query_string = { "$and": [ {"date": {"$lt": from_date}}, {"date": {"$gt": back_date}}] }

    print("aa", query_string)
    cursor = collection.find(query_string)
    df = pd.DataFrame(list(cursor))

    print(df.head())

    return df

from_date = '2021-04-04'
n_next_days = 30 #num days to predict
n_last_days = 60

filename = "stock_model_{}.h5".format(stock.lower())
model = load_model(filename)
with open('scalemodel_{}.pkl'.format(stock.lower()),'rb') as f:
    sc = pickle.load(f)

#Get data from previous 60 days
back_df = get_back_data_from_mongo(from_date, n_last_days)
back_set = back_df['Close'].values
back_set = back_set.reshape(-1, 1)

# [0,1]
back_set = sc.transform(back_set)
i = 0
from_date = datetime.datetime(int(from_date[:4]), int(from_date[5:7]), int(from_date[-2:]))


while i < n_next_days:
    X_test = [back_set[-60:, 0]]

    #get the last data
    X_test = np.array(X_test)
    X_test = np.reshape(X_test, (X_test.shape[0], X_test.shape[1], 1))

    predicted_stock_price = model.predict(X_test)
    predicted_stock_price_real = sc.inverse_transform(predicted_stock_price)
    #Include curent day
    back_set = np.append(back_set, predicted_stock_price, axis=0)

    # Display
    my_dict = {"date": from_date, "Close": float(predicted_stock_price_real[0][0])}
    x = collection.insert_one(my_dict)
    print('Stock price ' + str(from_date) + ' of MSFT : ', predicted_stock_price_real[0][0])
    from_date += BDay(1)
    i+= 1
