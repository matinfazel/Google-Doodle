from crypt import methods
import numpy as np
import tensorflow as tf
import numpy as np
import os
from functions import remove_alpha_channel
import time 
from flask import Flask
from flask_cors import CORS
from flask import request
import base64

app = Flask(__name__)
CORS(app)

with open("class_names.txt","r") as file:
    class_names = file.read()
    file.close()

class_names = class_names.split('\n')

model = tf.keras.Sequential()
model.add(tf.keras.layers.Convolution2D(16, (3, 3),
                        padding='same',
                        input_shape=(28,28,1), activation='relu'))
model.add(tf.keras.layers.MaxPooling2D(pool_size=(2, 2)))
model.add(tf.keras.layers.Convolution2D(32, (3, 3), padding='same', activation= 'relu'))
model.add(tf.keras.layers.MaxPooling2D(pool_size=(2, 2)))
model.add(tf.keras.layers.Convolution2D(64, (3, 3), padding='same', activation= 'relu'))
model.add(tf.keras.layers.MaxPooling2D(pool_size =(2,2)))
model.add(tf.keras.layers.Flatten())
model.add(tf.keras.layers.Dense(128, activation='relu'))
model.add(tf.keras.layers.Dense(345, activation='softmax')) 

model.compile(loss= 'categorical_crossentropy',
              optimizer = tf.optimizers.Adam(),
              metrics = ['top_k_categorical_accuracy'])

def predict():
    t1 = time.time()
    resized = remove_alpha_channel('/home/matin/Desktop/image.png')
    x_pred = np.reshape(resized,(1,28,28,1))
    result = model.predict(x_pred)
    os.system('clear')
    index = np.argmax(result,axis =1)[0]
    print(class_names[index],np.max(result,axis =1)[0]*100,time.time() - t1)
    return str(class_names[index]+ " " + str(np.max(result,axis =1)[0]*100)+ " " +str(time.time() - t1))

def save_image(img):

        img = img.replace('data:image/png;base64,',"")
        img = str.encode(img)
        with open("/home/matin/Desktop/image.png", "wb") as fh:
            fh.write(base64.decodebytes(img))

model = tf.keras.models.load_model('model.h5')

@app.route('/paint',methods = ['POST', 'GET'])
def image():
        img = request.get_json()['image']
        save_image(img)
        res = predict()
        return res


if __name__ == "__main__":
    app.run(host="localhost",port=8000,debug=True)