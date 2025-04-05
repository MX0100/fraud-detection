from faker import Faker
import random
import datetime


fake = Faker()
def generate_ach(transactions, output_file):
    now = datetime.datetime.now()
    file_creation_date = now.strftime('%y%m%d')
    file_creation_time = now.strftime('%H%M')

    def format_field(value, length, align='left', pad=' '):
        if align == 'left':
            return str(value).ljust(length, pad)[:length]
        else:
            return str(value).rjust(length, pad)[:length]

    def get_header():
        return (
            '101' +
            '123456789' +                # Immediate Destination
            '987654321' +                # Immediate Origin
            file_creation_date +
            file_creation_time +
            'A' +
            '094' +
            '10' +
            '1' +
            format_field('SENDER BANK', 23) +
            format_field('RECEIVER BANK', 23) +
            '0000001' + '\n'
        )

    def get_batch_header():
        return (
            '5200' +
            format_field('COMPANY NAME', 16) +
            format_field('PAYROLL', 20) +
            '1234567890' +
            'PPD' +
            file_creation_date +
            file_creation_date +
            format_field('', 3) +
            '1' +
            '123456789' +
            '0000001' + '\n'
        )

    def get_entry_detail(index, transaction):
        return (
            '627' +                                 # Transaction Code (checking credit)
            format_field(transaction["routing"], 9, 'right', '0') +
            format_field(transaction["account"], 17) +
            format_field(int(transaction["amount"] * 100), 10, 'right', '0') +
            format_field(transaction["id"], 15) +
            format_field(transaction["name"], 22) +
            format_field('', 2) +
            '0' +
            format_field('0000001', 8) + '\n'
        )

    def get_batch_control(count, total):
        return (
            '8200' +
            format_field(count, 6, 'right', '0') +
            format_field(total, 10, 'right', '0') +
            format_field('', 10) +
            format_field('', 10) +
            '123456789' +
            '987654321' +
            '0000001' + '\n'
        )

    def get_file_control(batch_count, entry_count, total_debit=0, total_credit=0):
        return (
            '9000' +
            format_field(batch_count, 6, 'right', '0') +
            format_field(entry_count, 6, 'right', '0') +
            format_field(entry_count, 10, 'right', '0') +
            format_field(total_debit, 12, 'right', '0') +
            format_field(total_credit, 12, 'right', '0') +
            format_field('', 39) + '\n'
        )

    with open(output_file, 'w') as f:
        f.write(get_header())
        f.write(get_batch_header())

        total_amount = 0
        for idx, txn in enumerate(transactions):
            f.write(get_entry_detail(idx + 1, txn))
            total_amount += int(txn["amount"] * 100)

        f.write(get_batch_control(len(transactions), total_amount))
        f.write(get_file_control(1, len(transactions), 0, total_amount))

def generate_random_transactions(n):
    transactions = []
    for i in range(n):
        txn = {
            "routing": "021000021",  # 可以改成随机但合法的 routing
            "account": str(fake.random_number(digits=9, fix_len=True)),
            "amount": round(random.uniform(10.0, 10000.0), 2),
            "name": fake.name(),
            "id": str(i + 1).zfill(6)
        }
        transactions.append(txn)
    return transactions

# 生成 1000 条交易数据
sample_transactions = generate_random_transactions(1000)

# 调用原函数生成 .ach 文件
generate_ach(sample_transactions, "bulk_output.ach")
