import numpy as np
import tensorflow as tf
from skimage.color import rgba2rgb
from skimage import data
import cv2

with open("class_names.txt","r") as file:
    class_names = file.read()
    file.close()
class_names = class_names.split('\n')

def black_and_white(img):
  for i in range(img.shape[0]):
    for j in range(img.shape[1]):
      if img[i][j] > 0:
        img[i][j] = 1
      else: 
        img[i][j] = 0

  return img

def reshape_data(x_train,x_test):
  x_train = x_train.reshape(x_train.shape[0],28,28,1).astype('float32')
  x_test = x_test.reshape(x_test.shape[0],28,28,1).astype('float32')
  return x_train,x_test

def classification(y_train,y_test):
  num_classes = len(class_names)
  y_train = tf.keras.utils.to_categorical(y_train,num_classes)
  y_test = tf.keras.utils.to_categorical(y_test,num_classes)
  return y_train,y_test

def array_equal(arr1):
   empty_x = np.array([0. for i in range(arr1.shape[0])])
   comparison = arr1 == empty_x
   equal_arrays = comparison.all()
   return equal_arrays

def resize_arr(arr):
  x1 = 0
  x2 = arr.shape[0]
  y1 = 0
  y2 = arr.shape[1]

  for i in range(arr.shape[0]):
    if not array_equal(arr[i,:]):
      x1 = i -1
      break;
  for i in range(arr.shape[0]-1,-1,-1):
    if not array_equal(arr[i,:]):
      x2 = i + 2 
      break;
  for j in range(arr.shape[1]):
    if not array_equal(arr[:,j]):
      y1 = j - 1
      break;
  for j in range(arr.shape[1]-1,-1,-1):
    if not array_equal(arr[:,j]):
      y2 = j + 2
      break;

  return arr[x1:x2,y1:y2]

def padding(arr):
  max_shape = max(arr.shape)
  min_shape = min(arr.shape)
  padding = max_shape - min_shape

  if (max_shape == min_shape):
    return arr;

  elif (arr.shape[0] == max_shape):
    if padding % 2 == 1: 
      arr = np.pad(arr, ((0, 0), (padding//2 + 1, padding//2)))
    else:
      arr = np.pad(arr, ((0, 0), (padding//2, padding//2)))

  elif (arr.shape[1] == max_shape):
    if padding % 2 == 1: 
      arr = np.pad(arr, ((padding//2 + 1, padding//2), (0, 0)))
    else:
      arr = np.pad(arr, ((padding//2, padding//2), (0, 0)))
  return arr

def remove_alpha_channel(path):
  img = cv2.imread(path, cv2.IMREAD_UNCHANGED)
  img = rgba2rgb(img)
  img = np.array(img, dtype=np.float32)
  resized = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
  resized[:,:] = 1 - resized[:,:]
  resized = resize_arr(resized)
  resized = padding(resized)
  resized = cv2.resize(resized, (26,26), interpolation = cv2.INTER_AREA)
  resized = black_and_white(resized)
  resized = np.pad(resized, ((1, 1), (1, 1)))
  return resized
