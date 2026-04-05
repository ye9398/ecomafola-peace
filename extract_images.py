import json
import base64
import os

with open('F:/xwechat_files/a504060516_65ac/msg/file/2026-04/product-content-config (2)(1).json', 'r', encoding='utf-8') as f:
    data = json.load(f)

product_handle = "samoan-handcrafted-coconut-bowl"
output_dir = f"public/images/products/{product_handle}"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

sections = ["story", "environmental", "partnership", "specifications", "guarantee"]
config = {}

for section in sections:
    section_data = data["products"][product_handle].get(section, {})
    img_data = section_data.get("image", "")
    if img_data.startswith("data:image"):
        try:
            # data:image/jpeg;base64,...
            header, encoded = img_data.split(",", 1)
            ext = header.split("/")[1].split(";")[0]
            filename = f"{section}.{ext}"
            filepath = os.path.join(output_dir, filename)
            with open(filepath, "wb") as img_file:
                img_file.write(base64.b64decode(encoded))
            
            # Update path in JSON
            section_data["image"] = f"/images/products/{product_handle}/{filename}"
        except Exception as e:
            print(f"Error processing {section}: {e}")

# Save the updated content back to the main ecomafola-content.json
content_path = 'public/admin-content/ecomafola-content.json'
with open(content_path, 'r', encoding='utf-8') as f:
    main_data = json.load(f)

if "products" not in main_data:
    main_data["products"] = {}

# Merge the product config
main_data["products"][product_handle] = data["products"][product_handle]

with open(content_path, 'w', encoding='utf-8') as f:
    json.dump(main_data, f, indent=2, ensure_ascii=False)
