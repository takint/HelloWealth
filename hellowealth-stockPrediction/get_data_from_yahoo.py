import yfinance as yf
import pymongo


stock='AC'
to_date = '2021-04-02'
from_date = '2016-01-01'

cluster_name = "cluster"
mongodb_user = ""
mongodb_pass = ""
db = 'stock_db'
collection_name = stock.lower()

stock_df = yf.download(stock, start=from_date, end=to_date, progress=False)
stock_df = stock_df.drop(columns=['Open', 'High', 'Low', 'Adj Close', 'Volume'])
stock_df = stock_df.reset_index()
print(stock_df.tail())


client = pymongo.MongoClient(
    "mongodb+srv://{}:{}@{}.mongodb.net/{}?retryWrites=true&w=majority".format(mongodb_user, mongodb_pass, cluster_name,
                                                                               db))
db = client.stock_db
collection = db[collection_name]
collection.drop()

for index, row in stock_df.iterrows():
    print(row['Date'])
    # break
    my_dict = {"date": row['Date'], "Close": row['Close']}
    x = collection.insert_one(my_dict)
