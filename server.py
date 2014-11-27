from flask import Flask, request, session, render_template, g, redirect, url_for, flash
import jinja2
import os

app = Flask(__name__)
app.secret_key = '\xf5!\x07!qj\xa4\x08\xc6\xf8\n\x8a\x95m\xe2\x04g\xbb\x98|U\xa2f\x03'
app.jinja_env.undefined = jinja2.StrictUndefined

word_dict = {}

@app.route("/")
def index():
  # word_dict = parse_dict('/usr/share/dict/words')
  word_dict = parse_dict('wordsEn.txt')
  return render_template("boggle.html")

@app.route("/check_word", methods=["POST"])
def check_word():
  word = request.form.get("word").lower()
  if word_dict.get(word) == True:
    return "True"
  return "False"

def parse_dict(fp):
  for line in open(fp):
    line = line.strip()
    word_dict[line] = True
  return word_dict

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, port=port)