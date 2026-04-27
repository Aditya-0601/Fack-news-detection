import subprocess
import sys

try:
    result = subprocess.run(['git', 'checkout', 'HEAD', '--', 'scc-project'], capture_output=True, text=True, check=True)
    print("STDOUT:", result.stdout)
    print("STDERR:", result.stderr)
except subprocess.CalledProcessError as e:
    print("Error:", e)
    print("STDOUT:", e.stdout)
    print("STDERR:", e.stderr)
