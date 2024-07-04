import tkinter as tk
from tkinter import filedialog
import pathlib
import cv2
import os
import shutil
from ultralytics import YOLO

# Delete the directory
directory_to_delete = pathlib.Path('E:\\IGlassLast\\runs\\detect\\predict')
shutil.rmtree(directory_to_delete, ignore_errors=True)
# Load a pretrained YOLO model
model = YOLO('E:\\IGlassLast\\best.pt')

def open_camera(callback):
    def on_left_click(event, x, y, flags, param):
        if event == cv2.EVENT_LBUTTONDOWN:
            nonlocal cap
            ret, frame = cap.read()
            cv2.imwrite("photo.jpg", frame)
            cap.release()
            cv2.destroyAllWindows()
            root.destroy()  # Destroy the main Tkinter window
            callback(process_image("photo.jpg"))
    cap = cv2.VideoCapture(0)
    cv2.namedWindow("Camera")
    cv2.setMouseCallback("Camera", on_left_click)

    while True:
        ret, frame = cap.read()
        cv2.imshow("Camera", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    cap.release()
    cv2.destroyAllWindows()

def upload_photo(callback):
    root.filename = filedialog.askopenfilename(initialdir="/", title="Select file", filetypes=(("image files", "*.jpg;*.jpeg;*.png;*.bmp;*.gif"),("all files","*.*")))
    if root.filename:
        shutil.copy(root.filename, "photo.jpg")
        root.destroy()  # Destroy the main Tkinter window immediately after uploading
        callback(process_image("photo.jpg"))

def process_image(image_path):
    # Run inference on the uploaded or captured image, saving both the image and detections to files
    results = model(image_path, save=True, save_txt=True)

    # Path to the saved txt file
    txt_path = f'E:\\IGlassLast\\runs\\detect\\predict\\labels\\photo.txt'
    # Extract class ID from the saved .txt file
    class_id = None
    try:
        with open(txt_path, 'r') as file:
            line = file.readline()
            class_id = line.split()[0] if line else None
    except FileNotFoundError:
        print("No detections were saved.")
    return class_id

root = tk.Tk()
root.title("Photo Capture/Upload and YOLO Detection")
root.geometry("300x200")

def handle_class_id(class_id):
    global x
    if class_id == "0":
        x = "Heart"
    elif class_id == "1":
        x = "Oblong"
    elif class_id == "2":
        x = "Oval"
    elif class_id == "3":
        x = "Round"
    elif class_id == "4":
        x = "Square"
    else:
        x = "Unknown"

camera_button = tk.Button(root, text="Open Camera", command=lambda: open_camera(handle_class_id))
camera_button.pack(pady=10)

upload_button = tk.Button(root, text="Upload Photo", command=lambda: upload_photo(handle_class_id))
upload_button.pack(pady=10)

root.mainloop()

print(x)


