import csv

with open("aid-data.csv") as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=",")
    aiddata_id = []
    year = []
    donor = []
    recipient = []
    amount = []
    purpose_code = []
    purpose_name = []
    data = [aiddata_id, year, donor, recipient, amount, purpose_code, purpose_name]
    table = []
    for i, row in enumerate(csv_reader):
        if i <= 1:
            continue
        for i, field in enumerate(row):
            data[i].append(field)
        table.append(row)
    print(f"#aiddata_id = {len(set(aiddata_id))}")
    print(f"#donor = {len(set(donor))}")
    print(f"#recipient = {len(set(recipient))}")
    print(f"#purpose_code = {len(set(purpose_code))}")
    print(f"#purpose_name = {len(set(purpose_name))}")
    print(f"max(year) = {max(year)}")
    print(f"min(year) = {min(year)}")
    print(f"max(amount) = {max(amount)}")
    print(f"min(amount) = {min(amount)}")
