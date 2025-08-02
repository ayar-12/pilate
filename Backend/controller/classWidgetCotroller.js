

const ClassWidget = require('../models/classWidage');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const getAllClassWidget = async (req, res) => {
  try {
    const widgets = await ClassWidget.find({});
    res.status(200).json({ success: true, data: widgets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateClassWidget = async (req, res) => {
  try {
    const { title, subTitle , headTitle, subHeadTitle, span} = req.body;
    const image = req.files?.image?.[0]?.path || null;
    const video = req.files?.video?.[0]?.path || null;

    if (!title || !subTitle || !headTitle || !subHeadTitle || !span) {
      return res.status(400).json({ success: false, message: 'Title and subtitle are required' });
    }

    let widget = await ClassWidget.findOne();

    if (widget) {
      widget.title = title;
      widget.subTitle = subTitle;
       widget.span = span;
      widget.subHeadTitle = subHeadTitle;
      widget.headTitle = headTitle;
      if (image) widget.image = image;
      if (video) widget.video = video;
      await widget.save();
    } else {
      widget = new ClassWidget({ title, subTitle, image, video,  headTitle, subHeadTitle, span });
      await widget.save();
    }

    res.status(200).json({ success: true, data: widget });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllClassWidget, updateClassWidget };
