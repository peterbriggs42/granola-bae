import sys
import json
from flask import Flask, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///markets.sqlite3'

db = SQLAlchemy(app)

class Market(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # TODO stick this in a PostGIS db instead of sqlite
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    name = db.Column(db.String(100))

    def __init__(self, id, lat, lng, name):
        self.id = id
        self.latitude = lat
        self.longitude = lng
        self.name = name
    
    def __repr__(self):
        return "<Point %d: Lat %s Lng %s>" % (self.id, self.latitude, self.longitude)

def import_market_data(db):
    with open('farmers-markets.json') as data_file:    
        data = json.load(data_file)
        for f in data["features"]:
            lng = f['geometry']['coordinates'][0]
            lat = f['geometry']['coordinates'][1]
            name = f['properties']['location']
            print("{2} ({0}, {1})".format(lat,lng,name))
            market = Market(None, lat, lng, name)
            db.session.add(market)
        db.session.commit()
    return


@app.route('/')
def index():
    markets = Market.query.all()
    return render_template('index.html', markets=markets)

@app.route('/market/<int:market_id>')
def get_market(market_id):
    markets = Market.query.filter_by(id=market_id).all()
    coords = [[market.latitude, market.longitude] for market in markets]
    return jsonify({"data": coords})

@app.route('/markets')
def get_all_markets():
    markets = Market.query.all()
    coords = [[market.latitude, market.longitude] for market in markets]
    return jsonify({"data": coords})

if __name__ == '__main__':
    if len(sys.argv) > 1:
        if sys.argv[1] == 'makedb':
            db.create_all()
            import_market_data(db)
        elif sys.argv[1] == 'readdb':
            markets = Market.query.all()
            if markets is None:
                print("No market data")
            for m in markets:
                print(m.name)
    else:
        app.run(debug=True)