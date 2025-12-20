from PIL import Image
import os

def remove_white_bg(path):
    try:
        img = Image.open(path)
        img = img.convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # Change all white (also shades of whites)
            # Find all pixels that are "close" to white
            if item[0] > 220 and item[1] > 220 and item[2] > 220:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(path, "PNG")
        print(f"Processed {path}")
    except Exception as e:
        print(f"Failed {path}: {e}")

assets = ["assets/operator_neutral.png", "assets/operator_happy.png", "assets/operator_surprised.png"]
for asset in assets:
    if os.path.exists(asset):
        remove_white_bg(asset)
    else:
        print(f"Not found: {asset}")
