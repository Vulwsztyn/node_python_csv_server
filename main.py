import sys
from hestia_earth.utils.table import pivot_csv
print(pivot_csv(sys.argv[1]).to_csv(index=False))
